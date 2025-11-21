import firestore from '@react-native-firebase/firestore';
import { Category } from '../hooks/useCategory';

export const categoryServices = {
    async addCategory(userId: string, categoryName: string): Promise<void> {
        if (!categoryName.trim()) { throw new Error('cateogyr name cannot be empty'); }

        try {
            await firestore()
              .collection('Users')
              .doc(userId)
              .collection('categories')
              .add({
                name: categoryName.trim().toLowerCase(),
                createdAt: firestore.FieldValue.serverTimestamp(),
              });
            console.log(`added category ${categoryName}`);
        }
        catch (e: any) {
            console.error(`error adding category: ${e}`)
            throw e;
        }
    },

    async deleteCategory(userId: string, categoryId: string, categoryName: string): Promise<void> {
        try {
            await firestore()
                .collection('Users')
                .doc(userId)
                .collection('categories')
                .doc(categoryId)
                .delete();
            
            const pantrySnapshot = await firestore()
                .collection('Users')
                .doc(userId)
                .collection('pantry')
                .where('category', 'array-contains', categoryName)
                .get();

            if (!pantrySnapshot.empty) {
                const batch = firestore().batch();

                pantrySnapshot.docs.forEach((pantryDoc) => {
                    const item = pantryDoc.data();
                    const updatedCategories = item.category.filter((cat: string) => cat !== categoryName);

                    batch.update(pantryDoc.ref, {
                        category: updatedCategories.length > 0 ? updatedCategories : ['other'],
                    });
                });

                await batch.commit()
                console.log(`updated ${pantrySnapshot.size} items - removed category ${categoryName}`);
            }

            console.log(`deleted category: ${categoryName}`);
        }
        catch (e: any) {
            console.error(`error deleting category: ${e}`);
            throw e;
        }
    },

    async editCategory(userId: string, categoryId: string, newCategoryName: string): Promise<void> {
        try {
            const trimmedName = newCategoryName.trim().toLowerCase();
            if (!trimmedName) { throw new Error('category name cannot be empty'); }

            const existingCategorySnapshot = await firestore()
                .collection('Users')
                .doc(userId)
                .collection('categories')
                .where('name', '==', trimmedName)
                .get();

            const isDuplicate = existingCategorySnapshot.docs.some(categoryDoc => categoryDoc.id !== categoryId);
            if (isDuplicate) { throw new Error('a category with this name already exists'); }

            const categoryDoc = await firestore()
                .collection('Users')
                .doc(userId)
                .collection('categories')
                .doc(categoryId)
                .get();

            if (!categoryDoc) { throw new Error('category not found'); }
            const oldCategoryName = categoryDoc.data()?.name;

            await firestore()
                .collection('Users')
                .doc(userId)
                .collection('categories')
                .doc(categoryId)
                .update({
                    name: trimmedName,
                    updatedAt: firestore.FieldValue.serverTimestamp(),
                });
            
            const pantrySnapshot = await firestore()
                .collection('Users')
                .doc(userId)
                .collection('pantry')
                .where('category', 'array-contains', oldCategoryName)
                .get();

            if (!pantrySnapshot.empty) {
                const batch = firestore().batch()

                pantrySnapshot.docs.forEach((pantryDoc) => {
                    const item = pantryDoc.data();

                    const updatedCategories = item.category.map((cat: string) => 
                        cat === oldCategoryName ? trimmedName : cat
                    );

                    batch.update(pantryDoc.ref, {
                        category: updatedCategories,
                    });
                });

                await batch.commit();
                console.log(`updated ${pantrySnapshot.size} items from ${oldCategoryName}`);
            }
            
            console.log(`renamed category from ${oldCategoryName} to ${trimmedName}`);
        }
        catch (e: any) {
            console.error(`unable to edit the category: ${e}`);
            throw e;
        }
    },

    async syncCategoriesFromPantry(userId: string): Promise<void> {
        try {
            console.log('starting category sync from pantry');

            const pantrySnapshot = await firestore()
                .collection('Users')
                .doc(userId)
                .collection('pantry')
                .get()

            const pantryCategories = new Set<string>();
            pantrySnapshot.docs.forEach((pantryDoc) => {
                const item = pantryDoc.data();
                console.log(`item.category: ${item.category}`);

                if (item.category && Array.isArray(item.category)) {
                    item.category.forEach((categoryName: string) => {
                        if (categoryName && categoryName.trim()) {
                            pantryCategories.add(categoryName.trim().toLowerCase());
                        }
                    });
                }
            });

            if (pantryCategories.size === 0) { console.log('no categories found in pantry'); }

            const categoriesSnapshot = await firestore()
                .collection('Users')
                .doc(userId)
                .collection('categories')
                .get()
            
            const existingCategories = new Set<string>();
            categoriesSnapshot.docs.forEach((categoriesDoc) => {
                const category = categoriesDoc.data();
                if (category.name) {
                    existingCategories.add(category.name.toLowerCase());
                }
            });

            const categoriesToAdd: string[] = [];
            pantryCategories.forEach((categoryName) => {
                if (!existingCategories.has(categoryName)) {
                    categoriesToAdd.push(categoryName);
                }
            });

            if (categoriesToAdd.length > 0) {
                const batch = firestore().batch();
                const categoriesColl = firestore()
                    .collection('Users')
                    .doc(userId)
                    .collection('categories');

                categoriesToAdd.forEach((categoryName) => {
                    const newCategoryDoc = categoriesColl.doc();
                    batch.set(newCategoryDoc, {
                        name: categoryName,
                        addedAt: firestore.FieldValue.serverTimestamp(),
                    });
                });

                await batch.commit();
                console.log(`synced ${categoriesToAdd.length} categories from pantry: ${categoriesToAdd}`);
            }
            else {
                console.log("no new category from pantry to sync");
                return;
            }
        }
        catch (e: any) {
            console.error(`error syncing categories: ${e}`);
            throw e;
        }
    },

    async getCategoriesWithCounts(userId: string): Promise<Category[]> {
        try {
            const categoriesSnapshot = await firestore()
                .collection('Users')
                .doc(userId)
                .collection('categories')
                .orderBy('name', 'asc')
                .get();

            const pantrySnapshot = await firestore()
                .collection('Users')
                .doc(userId)
                .collection('pantry')
                .get();

            const categoryCountMap = new Map<string, number>();
            pantrySnapshot.docs.forEach((pantryDoc) => {
                const item = pantryDoc.data();
                 
                if (item.category && Array.isArray(item.category)) {
                    item.category.forEach((cat: string) => {
                        const count = categoryCountMap.get(cat) || 0;
                        categoryCountMap.set(cat, count + 1);
                    });
                }
            });

            const categories: Category[] = categoriesSnapshot.docs.map((categoriesDoc) => {
                const field = categoriesDoc.data();
                return {
                    fireId: categoriesDoc.id,
                    name: field.name,
                    addedAt: field.addedAt,
                    itemCount: categoryCountMap.get(field.name) || 0,
                };
            });

            return categories;
        }
        catch (e: any) {
            console.error(`error getting categories with counts: ${e}`);
            throw e;
        }
    },
    
    async getItemsByCategories(userId: string, categoryNames: string[]): Promise<any[]> {
        try {
            if (categoryNames.length === 0) {
                const pantrySnapshot = await firestore()
                    .collection('Users')
                    .doc(userId)
                    .collection('pantry')
                    .get();

                return pantrySnapshot.docs.map((pantryDoc) => ({
                    id: pantryDoc.id,
                    ...pantryDoc.data(),
                }));
            }

            const items: any[] = [];
            return items;
        }
        catch (e: any) {
            console.error(`error getting items by categories: ${e}`);
            throw e;
        }
    },

    async categoryExists(userId: string, categoryName: string): Promise<boolean> {
        try {
            const categorySnapshot = await firestore()
                .collection('Users')
                .doc(userId)
                .collection('categories')
                .where('name', '==', categoryName.trim().toLowerCase())
                .limit(1)
                .get();

            return !categorySnapshot.empty;
        }
        catch (e: any) {
            console.error(`error checking if category exists: ${e}`);
            throw e;
        }
    },
}