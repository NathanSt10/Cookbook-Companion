import firestore from '@react-native-firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../app/context/AuthContext';

export type PantryItem = {
    id: string;
    name: string;
    category: string;
    quantity?: string;
    expiryDate?: string;
    addedAt: Date;
}

export function usePantry() {
  const { user } = useAuth();
  const [items, setItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
        Alert.alert("Error", "No user is logged in.");
        return;
    }

    const db = firestore()
      .collection('Users').doc(user.uid)
      .collection('pantry')
      .orderBy('addedAt', 'desc');

    const unsub = db.onSnapshot(
      (snap) => {
        const next: PantryItem[] = snap.docs.map((doc) => {
          const d = doc.data();
          console.log("doc.data:", d);
          return {
            id: doc.id,
            name: d.name,
            category: d.category,
            quantity: d.quantity ?? undefined,
            expiryDate: d.expiryDate ?? undefined,
            addedAt: d.addedAt?.toDate?.() ?? new Date(),
          };
        });
        setItems(next);
        setLoading(false);
      },
      (err) => { console.error('pantry listen error', err); setLoading(false); }
    );
    return unsub;
  }, [user]);

  const addItem = useCallback(async (data: { name: string; category: string; quantity?: string; }) => {
    if (!user) return;
    await firestore()
      .collection('Users').doc(user.uid)
      .collection('pantry')
      .add({
        name: data.name.trim(),
        category: data.category,
        quantity: (data.quantity ?? '').trim() || null,
        addedAt: firestore.FieldValue.serverTimestamp(),
      });
  }, [user]);

  const deleteItem = useCallback(async (id: string) => {
    if (!user) return;
    await firestore()
      .collection('Users').doc(user.uid)
      .collection('pantry')
      .doc(id)
      .delete();
  }, [user]);

  const stats = useMemo(() => ({
    totalItems: items.length,
    lowStockCount: items.filter(item => {
      if (!item.quantity) return false;
      const qty = parseFloat(item.quantity);
      return !isNaN(qty) && qty > 0 && qty <= 2;
    }).length
  }), [items]);

  return {
    items,
    loading,
    addItem,
    deleteItem,
    stats,
  } as const;
}
