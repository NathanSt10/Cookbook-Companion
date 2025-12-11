import firestore from '@react-native-firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../app/context/AuthContext';

export interface SavedRecipe {
  fireId: string;
  recipeId: string;
  title: string;
  image: string;
  addedAt: Date;
};

export function useSavedRecipes() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);

  const handleItemsFromSnap = useCallback((snapshot: any) => {
    console.log("handling items in saved recipes");
    const items: SavedRecipe[] = [];
    snapshot.forEach((savedRecipeDocument: any) => {
      const field = savedRecipeDocument.data();
      items.push({
        fireId: savedRecipeDocument.id,
        recipeId: field.recipeId,
        title: field.title,
        image: field.image,
        addedAt: field.addedAt?.toDate?.() || new Date(field.addedAt),
      });
    });

    return items;
  }, []);

  const removeSavedRecipes = useCallback(async (fireId: string) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      await firestore()
        .collection('Users')
        .doc(user.uid)
        .collection('savedRecipes')
        .doc(fireId)
        .delete();
      
      console.log(`Successfully removed saved recipe: ${fireId}`);
    } catch (e: any) {
      console.error(`Error removing saved recipe: ${e}`);
      throw e;
    }
  }, [user]);

  const refresh = useCallback(async () => {
    if (!user) { return; }
    setLoading(true);
    setError(null);

    try {
      const snapSavedRecipeColl = await firestore()
        .collection('Users')
        .doc(user.uid)
        .collection('savedRecipes')
        .get();

      const items = handleItemsFromSnap(snapSavedRecipeColl);
      setSavedRecipes(items);
      console.log(`built saved recipes ${items}`);
      setError(null);
    }
    catch (e: any) {
      setError(e);
      console.error(`useSavedRecipes refresh error: ${e}`);
    }
    finally {
      setLoading(false);
    }
  }, [user, handleItemsFromSnap]);
  
  useEffect(() => {
    console.log("using useSavedRecipes");
    if (!user) { return; }
    setLoading(true);
    setError(null);

    const unsubscribe = firestore()
      .collection('Users')
      .doc(user.uid)
      .collection('savedRecipes')
      .onSnapshot(
        (onSuccess) => {
          const items = handleItemsFromSnap(onSuccess);
          setSavedRecipes(items);
          setLoading(false);
          setError(null);
        },
        (onError) => {
          setError(onError);
          setLoading(false);
          console.error(`useSavedRecipes snapshot error: ${onError}`);
        }
      );

    return unsubscribe;
  }, [user, handleItemsFromSnap]);

  return {
      savedRecipes,
      loading,
      error,
      refresh,
      removeSavedRecipes,
  };      
}