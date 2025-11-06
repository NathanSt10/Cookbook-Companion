import firestore from '@react-native-firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../app/context/AuthContext';

export interface Category {
  fireId: string;
  name: string;
  isDefault: boolean;
  addedAt: Date;
}

export interface PantryItem {
    fireId: string;
    name: string;
    category: string;
    quantity?: string;
    expireDate?: string;
    addedAt: Date;
}

export interface PantryStats {
  totalItems: number;
  lowStockCount: number;
  expiringSoonCount: number;
  categoriesCount: number;
}

interface InputData {
  name: string;
  category: string;
  quantity?: string;
  expireDate?: string;
}

const DEFAULT_CATEGORIES: Omit<Category, 'fireId' | 'addedAt'>[] = [
  { name: 'Vegetables', isDefault: true },
  { name: 'Fruits', isDefault: true },
  { name: 'Dairy', isDefault: true },
  { name: 'Meat', isDefault: true },
  { name: 'Seafood', isDefault: true },
  { name: 'Grains & Pasta', isDefault: true },
  { name: 'Canned Goods', isDefault: true },
  { name: 'Snacks', isDefault: true },
  { name: 'Beverages', isDefault: true },
  { name: 'Condiments & Sauces', isDefault: true },
  { name: 'Spices & Seasonings', isDefault: true },
  { name: 'Baking', isDefault: true },
];

export function usePantry() {
  const { user } = useAuth();
  const [items, setItems] = useState<PantryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDefaultCategories = useCallback(async () => {
    if (!user) { return; }
    setLoading(true);
    setError(null);

    try {
      const defaultCateDoc = await firestore()
        .collection('Users')
        .doc(user.uid)
        .collection('categories');
      console.log("default cates: ", defaultCateDoc);
    }
    catch (e: any) {
      setError(e);
      console.error("usePantry: error fetching pantry data", e);
    }
    finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) { return; }
    setLoading(true);
    setError(null);

    fetchDefaultCategories();

    const unsubCategories = firestore()
      .collection('Users')
      .doc(user.uid)
      .collection('categories')
      .orderBy('name', 'asc')
      .onSnapshot(
        (snap) => {
          const categoriesData: Category[] = snap.docs.map((doc) => {
            const d = doc.data();
            return {
              fireId: doc.id,
              name: d.name,
              isDefault: d.isDefault,
              addedAt: d.addedAt?.toDate?.() ?? new Date(),
            };
          });
          setCategories(categoriesData);
        },
      );

    return unsubCategories;
  }, [user, fetchDefaultCategories]);

  useEffect(() => {
    if (!user) { return; }

    const unsubItems = firestore()
      .collection('Users')
      .doc(user.uid)
      .collection('pantry')
      .orderBy('addedAt', 'desc')
      .onSnapshot(
        (snap) => {
          const itemsData: PantryItem[] = snap.docs.map((doc) => {
            const d = doc.data();
            return {
              fireId: doc.id,
              name: d.name,
              category: d.category,
              quantity: d.quantity ?? undefined,
              expireDate: d.expireDate ?? undefined,
              addedAt: d.addedAt?.toDate?.() ?? new Date(),
            };
          });
          setItems(itemsData)
          setLoading(false);
        },
      );

      return unsubItems;
  }, [user]);

  const addCategory = useCallback(async (categoryName: string) => {
    if (!user) { return; }
    setLoading(true);
    setError(null);

    // can't be emptied
    // check if it already exists
    // try a firestore call and add it
    

  }, [user, categories]);

  const deleteCategory = useCallback(async () => {
    if (!user) { return; }
    setLoading(true)
    setError(null);

    // find the category name

    // check if any items use this category

  }, [user, categories, items]);

  const addItem = useCallback(async (data: InputData) => {
    if (!user) { return; }

    try {
      await firestore()
        .collection('Users')
        .doc(user.uid)
        .collection('pantry')
        .add({
          name: data.name.trim(),
          category: data.category,
          quantity: (data.quantity ?? '').trim() || null, // whet?
          expireDate: data.expireDate || null,
          addedAt: firestore.FieldValue.serverTimestamp(),
        })
        .then(() => console.log("added: ", data.name));
    }
    catch (e: any) {
      setError(e);
      console.error("error", error);
    }
  }, [user]);

  const deleteItem = useCallback(async (fireId: string) => {
    if (!user) { return; }

    try {
      await firestore()
        .collection('Users')
        .doc(user.uid)
        .collection('pantry')
        .doc(fireId)
        .delete()
        .then(() => console.log("item deleted: ", fireId));
    }
    catch (e: any) {
      setError(e);
      console.error("Error: ", e);
    }
  }, [user]);

  const stats: PantryStats = useMemo(() => {
    const lowStockCount = items.filter((item) => {
      if (!item.quantity) { return false; }

      const quantity = parseFloat(item.quantity);
      return !isNaN(quantity) && quantity > 0 && quantity <= 2;
    }).length;

    const expiringSoonCount = items.filter((item => {
      if (!item.expireDate) { return false; }
      console.log("think of a system for expiring items")
    })).length;

    return {
      totalItems: items.length,
      lowStockCount,
      expiringSoonCount,
      categoriesCount: categories.length,
    };
  }, [items, categories]);

  return {
    items,
    categories,
    categoryNames,
    loading,
    addItem,
    deleteItem,
    addCategory,
    deleteCategory,
    stats,
  } as const;
}