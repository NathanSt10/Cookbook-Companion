import firestore from '@react-native-firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../app/context/AuthContext';

export interface Category {
  fireId: string;
  name: string;
  addedAt: Date;
  agingDays?: number;
  urgentDays?: number;
}

export function useCategory() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const handleItemsFromSnap = useCallback((snapshot: any) => {
    console.log("handling items in categories");
    const items: Category[] = [];
    snapshot.forEach((categoryDocument: any) => {
      const field = categoryDocument.data();
      items.push({
        fireId: categoryDocument.id,
        name: field.name,
        addedAt: field.addedAt?.toDate?.() || new Date(field.addedAt),
        agingDays: field.agingDays,
        urgentDays: field.urgentDays,
      });
    });

    return items;
  }, []);

  const refresh = useCallback(async () => {
    console.log("refreshing useCategory")
    if (!user) { return; }
    setLoading(true);
    setError(null);

    try {
      const snapCategoryColl = await firestore()
        .collection('Users')
        .doc(user.uid)
        .collection('categories')
        .get();

      const items = handleItemsFromSnap(snapCategoryColl);
      setCategories(items);
      console.log(`built category ${items}`);
      setError(null);
    }
    catch (e: any) {
      setError(e);
      console.error(`useCategory refresh error: ${e}`);
    }
    finally {
      setLoading(false);
    }
  }, [user, handleItemsFromSnap]);
  
  useEffect(() => {
    console.log("using useCategory");
    if (!user) { return; }
    setLoading(true);
    setError(null);

    const unsubscribe = firestore()
      .collection('Users')
      .doc(user.uid)
      .collection('categories')
      .onSnapshot(
        (onSuccess) => {
          const items = handleItemsFromSnap(onSuccess);
          setCategories(items);
          setLoading(false);
          setError(null);
        },
        (onError) => {
          setError(onError);
          setLoading(false);
          console.error(`useCategory snapshot error: ${onError}`);
        }
      );

    return unsubscribe;
  }, [user, handleItemsFromSnap]);

  return {
      categories,
      loading,
      error,
      refresh,
  };      
}