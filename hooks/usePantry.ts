import firestore from '@react-native-firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../app/context/AuthContext';
import { pantryServices } from '../services/pantryServices';

export interface PantryItem {
  fireId: string;
  name: string;
  category: string[];
  quantity?: string | number;
  unit?: any;
  isPerishabe?: boolean;
  expireDate?: string;
  addedAt: Date;
}

export interface PantryItemInput {
  name: string;
  category: string[];
  quantity?: string;
  unit?: string;
  expireDate?: string;
}

export function usePantry() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pantry, setPantry] = useState<PantryItem[]>([]);
  const [stats, setStats] = useState({totalItems: 0, categoryCount: 0, lowStockCount: 0});
  const [statsLoading, setStatsLoading] = useState<Boolean>(true);

  const handleItemsFromSnap = useCallback((snapshot: any) => {
    const items: PantryItem[] = [];
    snapshot.forEach((pantryDocument: any) => {
      const field = pantryDocument.data();
      items.push({
        fireId: pantryDocument.id,
        name: field.name,
        category: field.category,
        quantity: field.quantity,
        unit: field.unit,
        expireDate: field.expireDate,
        addedAt: field.addedAt?.toDate?.() || new Date(field.addedAt),
      });
    });
    return items;
  }, []);

  const refresh = useCallback(async () => {
    console.log("refreshing usePantry");
    if (!user) { return; }
    setLoading(true);
    setError(null);

    try {
      const snapPantryColl = await firestore()
        .collection('Users')
        .doc(user.uid)
        .collection('pantry')
        .get();

      const items = handleItemsFromSnap(snapPantryColl);
      setPantry(items);
      console.log(`built pantry ${items}`);
      setError(null);
    }
    catch (e: any) {
      setError(e);
      console.error(`usePantry refresh error: ${e}`);
    }
    finally {
      setLoading(false);
    }
  }, [user, handleItemsFromSnap]);
  
  useEffect(() => {
    console.log("using usePantry");
    if (!user) { return; }
    setLoading(true);
    setError(null);
    
    const unsubscribe = firestore()
      .collection('Users')
      .doc(user.uid)
      .collection('pantry')
      .onSnapshot(
        (onSuccess) => {
          const items = handleItemsFromSnap(onSuccess);
          setPantry(items);
          setLoading(false);
          setError(null);
        },
        (onError) => {
          setError(onError);
          setLoading(false);
          console.error(`usePantry snapshot error: ${onError}`);
        }
      );

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!user) { return; }

    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const statsData = await pantryServices.getPantryStats(user.uid);
        setStats(statsData);
      }
      catch (e: any) {
        console.error(`error fetching stats ${e}`);
      }
      finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return {
      pantry,
      stats,
      loading,
      error,
      refresh,
  };      
}