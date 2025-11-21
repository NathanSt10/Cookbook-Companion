import firestore from '@react-native-firebase/firestore';

export interface SavedRecipeInput {
    recipeId: string,
    title: string;
    image: string;
}

export const savedRecipeServices = {
    async addSavedRecipe(userId: string, recipe: SavedRecipeInput): Promise<void> {
        try {
            await firestore()
                .collection('Users')
                .doc(userId)
                .collection('savedRecipes')
                .add({
                    recipeId: recipe.recipeId,
                    title: recipe.title,
                    image: recipe.image,
                    addedAt: firestore.FieldValue.serverTimestamp(),
                });

            console.log(`added recipe ${recipe.title} to saved recipes`);
        }
        catch (e: any) {
            console.error(`error adding saved recipe ${e}`);
            throw e;
        }
    },

    async removeSavedRecipe(userId: string, fireId: string): Promise<void> {
        try {
            await firestore()
                .collection('Users')
                .doc(userId)
                .collection('savedRecipes')
                .doc(fireId)
                .delete();
            console.log(`removed saved recipe with fireId: ${fireId}`);
        }
        catch (e: any) {
            console.error(`error removing saved recipe: ${e}`);
            throw e;
        }
    },

    async removeSavedRecipeByRecipeId(userId: string, recipeId: string): Promise<void> {
        try {
            const snapshot = await firestore()
                .collection('Users')
                .doc(userId)
                .collection('savedRecipes')
                .where('recipeId', '==', recipeId)
                .get();
            
            if (snapshot.empty) {
                console.log(`no saved recipe found with recipeID: ${recipeId}`);
                return;
            }

            const batch = firestore().batch();
            snapshot.docs.forEach((savedRecipeDoc) => {
                batch.delete(savedRecipeDoc.ref);
            });
            await batch.commit();

            console.log(`removed saved recipe with recipeId: ${recipeId}`);
        }
        catch (e: any) {
            console.error(`error removing saved recipe by recipeId: ${e}`);
            throw e;
        }
    },

    async isRecipeSaved(userId: string, recipeId: string): Promise<string | null> {
        try {
            const snapshot = await firestore()
                .collection('Users')
                .doc(userId)
                .collection('savedRecipes')
                .where('recipeId', '==', recipeId)
                .limit(1)
                .get();
            
            if (snapshot.empty) { return null; }

            return snapshot.docs[0].id;            
        }
        catch (e: any) {
            console.error(`error checking if recipe is saved: ${e}`);
            throw e;
        }
    },

    async toggleSavedRecipe(userId: string, recipe: SavedRecipeInput): Promise<boolean> {
        try {
            const fireId = await this.isRecipeSaved(userId, recipe.recipeId);

            if (fireId) {
                await this.removeSavedRecipe(userId, fireId);
                return false;
            }
            else {
                await this.addSavedRecipe(userId, recipe);
                return true;
            }
        }
        catch (e: any) {
            console.error(`error toggling saved recipe: ${e}`);
            throw e;
        }
    },
};