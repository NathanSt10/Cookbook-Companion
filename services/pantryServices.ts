import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';
import { Category, PantryItem } from '../hooks/usePantry';

const DEFAULT_CATEGORIES: Omit<Category, 'fireId' | 'addedAt'>[] = [
  { name: 'Vegetables' },
  { name: 'Fruits' },
  { name: 'Dairy' },
  { name: 'Meat' },
  { name: 'Seafood' },
  { name: 'Grains & Pasta' },
  { name: 'Canned Goods' },
  { name: 'Snacks' },
  { name: 'Beverages' },
  { name: 'Condiments & Sauces' },
  { name: 'Spices & Seasonings' },
  { name: 'Baking' },
];

export const pantryServices = {
  async initializeDefaultCategories(userId: string): Promise<void> {
    try {
      const categoriesRef = firestore()
        .collection('Users')
        .doc(userId)
        .collection('categories');

      const snapshot = await categoriesRef.limit(1).get();
      
      if (snapshot.empty) {
        const batch = firestore().batch();
        DEFAULT_CATEGORIES.forEach((cat) => {
          const docRef = categoriesRef.doc();
          batch.set(docRef, {
            name: cat.name,
            addedAt: firestore.FieldValue.serverTimestamp(),
          });
        });
        await batch.commit();
        console.log('Default categories initialized');
      }
    } catch (error) {
      console.error('Error initializing default categories:', error);
      throw error;
    }
  },

  async addCategory(userId: string, categoryName: string): Promise<void> {
    const trimmedName = categoryName.trim();
    if (!trimmedName) {
      throw new Error('Category name cannot be empty');
    }

    try {
      await firestore()
        .collection('Users')
        .doc(userId)
        .collection('categories')
        .add({
          name: trimmedName,
          addedAt: firestore.FieldValue.serverTimestamp(),
        });
      console.log('Category added:', trimmedName);
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },


  async deleteCategory(
    userId: string, 
    categoryId: string, 
    categoryName: string,
  ): Promise<void> {
    try {
      await firestore()
        .collection('Users')
        .doc(userId)
        .collection('categories')
        .doc(categoryId)
        .delete();
      console.log('Category deleted:', categoryName);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },


  async renameCategory(
    userId: string,
    categoryId: string,
    newName: string
  ): Promise<void> {
    const trimmedName = newName.trim();
    if (!trimmedName) {
      throw new Error('Category name cannot be empty');
    }

    try {
      await firestore()
        .collection('Users')
        .doc(userId)
        .collection('categories')
        .doc(categoryId)
        .update({
          name: trimmedName,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      console.log('Category renamed to:', trimmedName);
    } catch (error) {
      console.error('Error renaming category:', error);
      throw error;
    }
  },

  async getCategoryItemCount(userId: string, categoryName: string): Promise<number> {
    try {
      const snapshot = await firestore()
        .collection('Users')
        .doc(userId)
        .collection('pantry')
        .where('category', '==', categoryName)
        .get();
      
      return snapshot.size;
    } catch (error) {
      console.error('Error getting category item count:', error);
      throw error;
    }
  },

  async addItem(
    userId: string,
    data: {
      name: string;
      category: string;
      quantity?: string;
      expireDate?: string;
    }
  ): Promise<void> {
    try {
      await firestore()
        .collection('Users')
        .doc(userId)
        .collection('pantry')
        .add({
          name: data.name.trim(),
          category: data.category.trim(),
          quantity: data.quantity?.trim() || null,
          expireDate: data.expireDate || null,
          addedAt: firestore.FieldValue.serverTimestamp(),
        });
      console.log('Item added:', data.name);
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  },

  async updateItem(
    userId: string,
    itemId: string,
    updates: {
      name?: string;
      category?: string;
      quantity?: string;
      expireDate?: string;
    }
  ): Promise<void> {
    const cleanUpdates: any = {
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    if (updates.name !== undefined) {
      cleanUpdates.name = updates.name.trim();
    }
    if (updates.category !== undefined) {
      cleanUpdates.category = updates.category.trim();
    }
    if (updates.quantity !== undefined) {
      cleanUpdates.quantity = updates.quantity.trim() || null;
    }
    if (updates.expireDate !== undefined) {
      cleanUpdates.expireDate = updates.expireDate || null;
    }

    try {
      await firestore()
        .collection('Users')
        .doc(userId)
        .collection('pantry')
        .doc(itemId)
        .update(cleanUpdates);
      console.log('Item updated:', itemId);
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  },

  async deleteItem(userId: string, itemId: string): Promise<void> {
    try {
      await firestore()
        .collection('Users')
        .doc(userId)
        .collection('pantry')
        .doc(itemId)
        .delete();
      console.log('Item deleted:', itemId);
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  },

  async deleteMultipleItems(userId: string, itemIds: string[]): Promise<void> {
    try {
      const batch = firestore().batch();
      itemIds.forEach((itemId) => {
        const docRef = firestore()
          .collection('Users')
          .doc(userId)
          .collection('pantry')
          .doc(itemId);
        batch.delete(docRef);
      });
      await batch.commit();
      console.log(`Deleted ${itemIds.length} items`);
    } catch (error) {
      console.error('Error deleting multiple items:', error);
      throw error;
    }
  },

  async updateQuantity(
    userId: string,
    itemId: string,
    newQuantity: string
  ): Promise<void> {
    try {
      await firestore()
        .collection('Users')
        .doc(userId)
        .collection('pantry')
        .doc(itemId)
        .update({
          quantity: newQuantity.trim() || null,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      console.log('Quantity updated for item:', itemId);
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  },

  async searchItemsByName(userId: string, searchTerm: string): Promise<PantryItem[]> {
    try {
      const snapshot = await firestore()
        .collection('Users')
        .doc(userId)
        .collection('pantry')
        .get();

      const items: PantryItem[] = snapshot.docs
        .map((doc) => {
          const d = doc.data();
          return {
            fireId: doc.id,
            name: d.name,
            category: d.category,
            quantity: d.quantity ?? undefined,
            expireDate: d.expireDate ?? undefined,
            addedAt: d.addedAt?.toDate?.() ?? new Date(),
          };
        })
        .filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

      return items;
    } catch (error) {
      console.error('Error searching items:', error);
      throw error;
    }
  },

  async getItemsByCategory(userId: string, categoryName: string): Promise<PantryItem[]> {
    try {
      const snapshot = await firestore()
        .collection('Users')
        .doc(userId)
        .collection('pantry')
        .where('category', '==', categoryName)
        .orderBy('addedAt', 'desc')
        .get();

      const items: PantryItem[] = snapshot.docs.map((doc) => {
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

      return items;
    } catch (error) {
      console.error('Error getting items by category:', error);
      throw error;
    }
  },

  async getLowStockItems(userId: string): Promise<PantryItem[]> {
    try {
      const snapshot = await firestore()
        .collection('Users')
        .doc(userId)
        .collection('pantry')
        .get();

      const items: PantryItem[] = snapshot.docs
        .map((doc) => {
          const d = doc.data();
          return {
            fireId: doc.id,
            name: d.name,
            category: d.category,
            quantity: d.quantity ?? undefined,
            expireDate: d.expireDate ?? undefined,
            addedAt: d.addedAt?.toDate?.() ?? new Date(),
          };
        })
        .filter((item) => {
          if (!item.quantity) return false;
          const qty = parseFloat(item.quantity);
          return !isNaN(qty) && qty > 0 && qty <= 2;
        });

      return items;
    } catch (error) {
      console.error('Error getting low stock items:', error);
      throw error;
    }
  },

  async getAvailableIngredients(userId: string): Promise<string[]> {
    try {
      const snapshot = await firestore()
        .collection('Users')
        .doc(userId)
        .collection('pantry')
        .get();

      const ingredients = snapshot.docs.map((doc) => doc.data().name);
      return ingredients;
    } catch (error) {
      console.error('Error getting available ingredients:', error);
      throw error;
    }
  },

  async getPantrySummary(userId: string): Promise<Record<string, string[]>> {
    try {
      const snapshot = await firestore()
        .collection('Users')
        .doc(userId)
        .collection('pantry')
        .get();

      const summary: Record<string, string[]> = {};
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (!summary[data.category]) {
          summary[data.category] = [];
        }
        summary[data.category].push(data.name);
      });

      return summary;
    } catch (error) {
      console.error('Error getting pantry summary:', error);
      throw error;
    }
  },

  async hasIngredients(userId: string, ingredientNames: string[]): Promise<boolean> {
    try {
      const availableIngredients = await this.getAvailableIngredients(userId);
      const availableSet = new Set(
        availableIngredients.map((i) => i.toLowerCase())
      );

      return ingredientNames.every((ingredient) =>
        availableSet.has(ingredient.toLowerCase())
      );
    } catch (error) {
      console.error('Error checking ingredients:', error);
      throw error;
    }
  },

  async getPantryStats(userId: string): Promise<{
    totalItems: number;
    lowStockCount: number;
    expiringSoonCount: number;
    categoriesCount: number;
    mostUsedCategory: string;
    totalValue?: number;
  }> {
    try {
      const [itemsSnapshot, categoriesSnapshot] = await Promise.all([
        firestore()
          .collection('Users')
          .doc(userId)
          .collection('pantry')
          .get(),
        firestore()
          .collection('Users')
          .doc(userId)
          .collection('categories')
          .get(),
      ]);

      const items: PantryItem[] = itemsSnapshot.docs.map((doc) => {
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

      const lowStockCount = items.filter((item) => {
        if (!item.quantity) return false;
        const qty = parseFloat(item.quantity);
        return !isNaN(qty) && qty > 0 && qty <= 2;
      }).length;

      const today = new Date();
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(today.getDate() + 7);

      const expiringSoonCount = items.filter((item) => {
        if (!item.expireDate) return false;
        const expiryDate = new Date(item.expireDate);
        return expiryDate >= today && expiryDate <= sevenDaysFromNow;
      }).length;

      const categoryCount: Record<string, number> = {};
      items.forEach((item) => {
        categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
      });

      const mostUsedCategory =
        Object.keys(categoryCount).reduce((a, b) =>
          categoryCount[a] > categoryCount[b] ? a : b
        , 'None');

      return {
        totalItems: items.length,
        lowStockCount,
        expiringSoonCount,
        categoriesCount: categoriesSnapshot.size,
        mostUsedCategory,
      };
    } catch (error) {
      console.error('Error getting pantry stats:', error);
      throw error;
    }
  },
};