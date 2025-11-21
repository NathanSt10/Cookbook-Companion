import firestore from '@react-native-firebase/firestore';

export interface LikedRecipeInput {
    recipeId: string,
    title: string;
    image: string;
}

export const likedRecipeServices = {
    async addLikedRecipe(userId: string, recipe: LikedRecipeInput): Promise<void> {
        try {
            await firestore()
                .collection('Users')
                .doc(userId)
                .collection('likedRecipes')
                .add({
                    recipeId: recipe.recipeId,
                    title: recipe.title,
                    image: recipe.image,
                    addedAt: firestore.FieldValue.serverTimestamp(),
                });

            console.log(`added recipe ${recipe.title} to liked recipes`);
        }
        catch (e: any) {
            console.error(`error adding liked recipe ${e}`);
            throw e;
        }
    },

    async removeLikedRecipe(userId: string, fireId: string): Promise<void> {
        try {
            await firestore()
                .collection('Users')
                .doc(userId)
                .collection('likedRecipes')
                .doc(fireId)
                .delete();
            console.log(`removed liked recipe with fireId: ${fireId}`);
        }
        catch (e: any) {
            console.error(`error removing liked recipe: ${e}`);
            throw e;
        }
    },

    async removeLikedRecipeByRecipeId(userId: string, recipeId: string): Promise<void> {
        try {
            const snapshot = await firestore()
                .collection('Users')
                .doc(userId)
                .collection('likedRecipes')
                .where('recipeId', '==', recipeId)
                .get();
            
            if (snapshot.empty) {
                console.log(`no liked recipe found with recipeID: ${recipeId}`);
                return;
            }

            const batch = firestore().batch();
            snapshot.docs.forEach((likedRecipeDoc) => {
                batch.delete(likedRecipeDoc.ref);
            });
            await batch.commit();

            console.log(`removed liked recipe with recipeId: ${recipeId}`);
        }
        catch (e: any) {
            console.error(`error removing liked recipe by recipeId: ${e}`);
            throw e;
        }
    },

    async isRecipeLiked(userId: string, recipeId: string): Promise<string | null> {
        try {
            const snapshot = await firestore()
                .collection('Users')
                .doc(userId)
                .collection('likedRecipes')
                .where('recipeId', '==', recipeId)
                .limit(1)
                .get();
            
            if (snapshot.empty) { return null; }

            return snapshot.docs[0].id;            
        }
        catch (e: any) {
            console.error(`error checking if recipe is liked: ${e}`);
            throw e;
        }
    },

    async toggleLikedRecipe(userId: string, recipe: LikedRecipeInput): Promise<boolean> {
        try {
            const fireId = await this.isRecipeLiked(userId, recipe.recipeId);

            if (fireId) {
                await this.removeLikedRecipe(userId, fireId);
                return false;
            }
            else {
                await this.addLikedRecipe(userId, recipe);
                return true;
            }
        }
        catch (e: any) {
            console.error(`error toggling liked recipe: ${e}`);
            throw e;
        }
    },
};