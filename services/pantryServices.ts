import firestore from '@react-native-firebase/firestore';
import { PantryItemInput } from '../hooks/usePantry';

export const pantryServices = {
  async addItem(userId: string, itemData: PantryItemInput): Promise<void> {
    if (!itemData.name.trim()) { throw new Error("item name cannot be empty") }

    let categories = Array.isArray(itemData.category) 
      ? itemData.category.filter(cat => cat && cat.trim().toLowerCase())
      : (itemData.category ? [itemData.category] : []);

    if (categories.length === 0) {
      categories = ['other'];
      console.log('no category specified, setting to other');
    }

    const itemToAdd: any = {
      name: itemData.name.trim(),
      category: categories.map(cat => cat.trim().toLowerCase()),
      addedAt: firestore.FieldValue.serverTimestamp(),
    };

    if (itemData.quantity !== undefined && itemData.quantity !== '') {
      itemToAdd.quantity = itemData.quantity;
    }

    if (itemData.unit !== undefined && itemData.unit !== '') {
      itemToAdd.unit = itemData.unit.trim();
    }

    // when expiration is implemented, add here

    try {
      await firestore()
        .collection('Users')
        .doc(userId)
        .collection('pantry')
        .add(itemToAdd);

      console.log(`adding to pantry ${itemData}`);
    }
    catch(e: any) { 
      console.error(`error adding to the pantry: ${e}`);
      throw e;
    }
  },

  async editItem(userId: string, itemId: string, updates: Partial<PantryItemInput>): Promise<void> {
    if (!updates.name) {
      throw new Error("item name cannot be empty");
    }

    const updateData: any = {};

    if (updates.name !== undefined) {
      updateData.name = updates.name.trim();
      console.log(`updating name to ${updateData.name}`);
    }

    if (updates.category) {
      const categories = Array.isArray(updates.category)
        ? updates.category
        : [updates.category];

      if (categories.length === 0 || !categories[0].trim()) {
        updates.category = ['other'];
        console.log('updated pantry item with no category, setting to other');
      }
      else {
        updates.category = categories.map(cat => cat.trim().toLowerCase()) as any;
      }
    }

    if (updates.quantity !== undefined) {
      if (updates.quantity === '' || updates.quantity === null) {
        updateData.quantity = firestore.FieldValue.delete();
      }
      else {
        updateData.quantity = updates.quantity;
      }
    }

    if (updates.unit !== undefined) {
      if (updates.unit === '' || updates.unit === null) {
        updateData.unit = firestore.FieldValue.delete();
      }
      else {
        updateData.unit = updates.unit.trim();
      }
    }

    // use this part to do expiration dates

    try {
      await firestore()
        .collection('Users')
        .doc(userId)
        .collection('pantry')
        .doc(itemId)
        .update(updateData);
        
      console.log(`updated pantry item successfully for: ${itemId}`);
     } 
    catch (e: any) {
      console.error('error updating pantry item: ', e);
      console.error(`error updating pantry: ${e}`);
      throw e;
    }
  },

  async deleteItem(userId: string, itemId: string): Promise<void> {
    try {
      await firestore()
        .collection('Users')
        .doc(userId)
        .collection('pantry')
        .doc(itemId)
        .delete()
      
      console.log(`deleted pantry item: ${itemId}`);
    }
    catch (e: any) {
      console.error(`error deleting pantry item: ${e}`);
      throw e;
    }
  },
  
  async bulkDeleteItems(userId: string, itemIds: string[]): Promise<void> {
    try {
      const deletePicked = itemIds.map(async itemId => {
        await firestore()
          .collection('Users')
          .doc(userId)
          .collection('pantry')
          .doc(itemId)
          .delete()
      });

      await Promise.all(deletePicked);
      console.log(`bulk deleted ${itemIds.length} items`);
    }
    catch (e: any) {
      console.error(`error bulk deleting: ${e}`);
      throw e;
    }
  },

  async getPantryStats(userId: string): Promise<{totalItems: number, categoryCount: number, lowStockCount: number}> {
    try {
      const pantrySnapshot = await firestore()
        .collection('Users')
        .doc(userId)
        .collection('pantry')
        .get();

      const categories = new Set<string>();
      let lowStockCount = 0;

      pantrySnapshot.docs.forEach((pantryDoc) => {
        const item = pantryDoc.data();

        if (item.category && Array.isArray(item.category)) { 
          item.category.forEach((cat: string) => categories.add(cat)); 
        }

        const quantity = typeof item.quantity === 'string'
          ? parseFloat(item.quantity)
          : item.quantity;

          if (!isNaN(quantity) && quantity > 0 && quantity <= 2) {
            lowStockCount++;
          }
      });

      const stats = {
        totalItems: pantrySnapshot.size,
        categoryCount: categories.size,
        lowStockCount,
      };

      console.log(`pantry stats: ${stats}`);
      return stats;
    }
    catch (e: any) {
      console.error(`error getting pantry stats: ${e}`);
      throw e;
    }
  },

  async getPantryItemCount(userId: string): Promise<number> {
    try {
      const pantrySnapshot = await firestore()
        .collection('Users')
        .doc(userId)
        .collection('pantry')
        .get();

      console.log(`pantry item count: ${pantrySnapshot.size}`);
      return pantrySnapshot.size;
    }
    catch (e: any) {
      console.error(`error getting pantry item count ${e}`);
      throw e;
    }
  },

  async getPantryItemCountByCategory(userId: string, categoryName: string): Promise<number> {
    try {
      const pantrySnapshot = await firestore()
        .collection('Users')
        .doc(userId)
        .collection('pantry')
        .where('category', 'array-contains', categoryName.toLowerCase())
        .get();

      console.log(`pantry item count for ${categoryName}: ${pantrySnapshot.size}`);
      return pantrySnapshot.size;      
    }
    catch (e: any) {
      console.error(`unable to get pantry item with ${categoryName} from pantry`)
      throw e;
    }
  },

  async getPantryLowStockAlert(userId: string): Promise<void> {
    // Todo, find a low stock system
  },

  async addCategoryToItem(userId: string, itemId: string, categoryName: string): Promise<void> {
    try {
      await firestore() 
        .collection('Users')
        .doc(userId)
        .collection('pantry')
        .doc(itemId)
        .update({
          category: firestore.FieldValue.arrayUnion(categoryName.trim().toLowerCase())
        });

      console.log(`added category ${categoryName} to item ${itemId}`);
    }
    catch (e: any) {
      console.error(`error adding category to item ${e}`); 
      throw e;
    }
  },

  async deleteCategoryFromItem(userId: string, itemId: string, categoryName: string): Promise<void> {
    try {
      await firestore()
        .collection('Users')
        .doc(userId)
        .collection('pantry')
        .doc(itemId)
        .update({
          category: firestore.FieldValue.arrayRemove(categoryName.trim().toLowerCase()),
        });

      console.log(`removed category ${categoryName} from item ${itemId}`);
    }
    catch (e: any) {
      console.error(`error deleting category to item ${e}`);
      throw e;
    }
  },
}