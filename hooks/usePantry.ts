import firestore from '@react-native-firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../app/context/AuthContext';
import { pantryServices } from '../services/pantryServices';

export interface Category {
  fireId: string;
  name: string;
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

export function usePantry() {
  const { user } = useAuth();
  const [items, setItems] = useState<PantryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) return;

    const initializeCategories = async () => {
      try {
        await pantryServices.initializeDefaultCategories(user.uid);
      } catch (error) {
        console.error('Error initializing categories:', error);
      }
    };

    initializeCategories();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

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
              isDefault: d.isDefault ?? false,
              addedAt: d.addedAt?.toDate?.() ?? new Date(),
            };
          });
          setCategories(categoriesData);
        },
        (err) => {
          setError(err);
          console.error('Categories listen error:', err);
        }
      );

    return unsubCategories;
  }, [user]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

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
          setItems(itemsData);
          setLoading(false);
        },
        (err) => {
          setError(err);
          console.error('Pantry items listen error:', err);
          setLoading(false);
        }
      );

    return unsubItems;
  }, [user]);

  const addCategory = useCallback(
    async (categoryName: string) => {
      if (!user) return;

      const trimmedName = categoryName.trim();
      if (!trimmedName) {
        Alert.alert('Error', 'Category name cannot be empty');
        return;
      }

      const exists = categories.some(
        (cat) => cat.name.toLowerCase() === trimmedName.toLowerCase()
      );

      if (exists) {
        Alert.alert('Error', 'This category already exists');
        return;
      }

      try {
        await pantryServices.addCategory(user.uid, trimmedName);
      }  
      catch (error) {
        console.error('Error adding category:', error);
        Alert.alert('Error', 'Failed to add category');
      }
    },
    [user, categories]
  );

  const deleteCategory = useCallback(
    async (categoryId: string) => {
      if (!user) return;

      const category = categories.find((cat) => cat.fireId === categoryId);
      if (!category) return;

      const itemsInCategory = items.filter(
        (item) => item.category === category.name
      );

      if (itemsInCategory.length > 0) {
        Alert.alert(
          'Warning',
          `${itemsInCategory.length} item(s) are in this category. Delete anyway?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: async () => {
                try {
                  await pantryServices.deleteCategory(
                    user.uid,
                    categoryId,
                    category.name,
                  );
                } catch (error) {
                  console.error('Error deleting category:', error);
                  Alert.alert('Error', 'Failed to delete category');
                }
              },
            },
          ]
        );
      } else {
        try {
          await pantryServices.deleteCategory(
            user.uid,
            categoryId,
            category.name,
          );
        } catch (error) {
          console.error('Error deleting category:', error);
          Alert.alert('Error', 'Failed to delete category');
        }
      }
    },
    [user, categories, items]
  );

  const addItem = useCallback(
    async (data: InputData) => {
      if (!user) return;

      try {
        await pantryServices.addItem(user.uid, data);
      } catch (error) {
        console.error('Error adding item:', error);
        Alert.alert('Error', 'Failed to add item');
        throw error;
      }
    },
    [user]
  );

  const updateItem = useCallback(
    async (itemId: string, updates: Partial<InputData>) => {
      if (!user) return;

      try {
        await pantryServices.updateItem(user.uid, itemId, updates);
      } 
      catch (error) {
        console.error('Error updating item:', error);
        Alert.alert('Error', 'Failed to update item');
        throw error;
      }
    },
    [user]
  );

  const deleteItem = useCallback(
    async (fireId: string) => {
      if (!user) return;

      try {
        await pantryServices.deleteItem(user.uid, fireId);
      } 
      catch (error) {
        console.error('Error deleting item:', error);
        Alert.alert('Error', 'Failed to delete item');
      }
    },
    [user]
  );

  const getAvailableIngredients = useCallback(async () => {
    if (!user) return [];
    try {
      return await pantryServices.getAvailableIngredients(user.uid);
    } 
    catch (error) {
      console.error('Error getting ingredients:', error);
      return [];
    }
  }, [user]);

  const stats: PantryStats = useMemo(() => {
    const lowStockCount = items.filter((item) => {
      if (!item.quantity) return false;
      const quantity = parseFloat(item.quantity);
      return !isNaN(quantity) && quantity > 0 && quantity <= 2;
    }).length;

    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);

    const expiringSoonCount = items.filter((item) => {
      if (!item.expireDate) return false;
      const expiryDate = new Date(item.expireDate);
      return expiryDate >= today && expiryDate <= sevenDaysFromNow;
    }).length;

    return {
      totalItems: items.length,
      lowStockCount,
      expiringSoonCount,
      categoriesCount: categories.length,
    };
  }, [items, categories]);

  const categoryNames = useMemo(() => {
    return categories.map((cat) => cat.name);
  }, [categories]);

  return {
    items,
    categories,
    categoryNames,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    addCategory,
    deleteCategory,
    getAvailableIngredients,
    stats,
  } as const;
}