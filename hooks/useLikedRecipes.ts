import firestore from '@react-native-firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../app/context/AuthContext';

export interface LikedRecipe {
  fireId: string;
  recipeId: string;
  title: string;
  image: string;
  addedAt: Date;
};

export function useLikedRecipes() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [likedRecipes, setLikedRecipes] = useState<LikedRecipe[]>([]);

  const handleItemsFromSnap = useCallback((snapshot: any) => {
    console.log("handling items in liked recipes");
    const items: LikedRecipe[] = [];
    snapshot.forEach((likedRecipesDocument: any) => {
      const field = likedRecipesDocument.data();
      items.push({
        fireId: likedRecipesDocument.id,
        recipeId: field.recipeId,
        title: field.title,
        image: field.image,
        addedAt: field.addedAt?.toDate?.() || new Date(field.addedAt),
      });
    });

    return items;
  }, []);

  const removeLikedRecipe = useCallback(async (fireId: string) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      await firestore()
        .collection('Users')
        .doc(user.uid)
        .collection('likedRecipes')
        .doc(fireId)
        .delete();
      
      console.log(`Successfully removed liked recipe: ${fireId}`);
    } catch (e: any) {
      console.error(`Error removing liked recipe: ${e}`);
      throw e;
    }
  }, [user]);

  const refresh = useCallback(async () => {
    if (!user) { return; }
    setLoading(true);
    setError(null);

    try {
      const snapLikedRecipeColl = await firestore()
        .collection('Users')
        .doc(user.uid)
        .collection('likedRecipes')
        .get();

      const items = handleItemsFromSnap(snapLikedRecipeColl);
      setLikedRecipes(items);
      console.log(`built liked recipes ${items}`);
      setError(null);
    }
    catch (e: any) {
      setError(e);
      console.error(`useLikedRecipes refresh error: ${e}`);
    }
    finally {
      setLoading(false);
    }
  }, [user, handleItemsFromSnap]);
  
  useEffect(() => {
    console.log("using useLikedRecipes");
    if (!user) { return; }
    setLoading(true);
    setError(null);

    const unsubscribe = firestore()
      .collection('Users')
      .doc(user.uid)
      .collection('likedRecipes')
      .onSnapshot(
        (onSuccess) => {
          const items = handleItemsFromSnap(onSuccess);
          setLikedRecipes(items);
          setLoading(false);
          setError(null);
        },
        (onError) => {
          setError(onError);
          setLoading(false);
          console.error(`useLikedRecipes snapshot error: ${onError}`);
        }
      );

    return unsubscribe;
  }, [user, handleItemsFromSnap]);

  return {
      likedRecipes,
      loading,
      error,
      refresh,
      removeLikedRecipe,
  };      
}