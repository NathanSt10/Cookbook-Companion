import firestore from '@react-native-firebase/firestore';

export type PlannedMeal = {
    fireId: string;
    recipeId: string;
    title: string;
    image: string;
    date: string; // YYYY-MM-DD
    addedAt: Date;
}

type PlannedMealInput = Omit<PlannedMeal, 'fireId' | 'addedAt'>;

export const plannedMealsServices = {
    async addPlannedMeal(userId: string, mealData: PlannedMealInput): Promise<void> {
        try {
            const plannedMealsDoc = await firestore()
                .collection('Users')
                .doc(userId)
                .collection('plannedMeals')
                .add({
                    ...mealData,
                    addedAt: firestore.FieldValue.serverTimestamp(),
                });

            console.log(`added planned meal: ${mealData.title} for ${mealData.date}`);
        }
        catch (e: any) {
            console.error(`error adding planned meal: ${e}`);
            throw e;
        }
    },

    async deletePlannedMeal(userId: string, fireId: string): Promise<void> {
        try {
            await firestore()
                .collection('Users')
                .doc(userId)
                .collection('plannedMeals')
                .doc(fireId)
                .delete();
            
            console.log(`removed planned meal: ${fireId}`);
        }
        catch (e: any) {
            console.error(`error deleting planned meal: ${e}`);
            throw e;
        }
    },

    async getPlannedMeals(userId: string): Promise<PlannedMeal[]> {
        try {
            const plannedMealsSnapshot = await firestore()
                .collection('Users')
                .doc(userId)
                .collection('plannedMeals')
                .orderBy('date', 'asc')
                .get();

            const meals: PlannedMeal[] = plannedMealsSnapshot.docs.map(doc => ({
                fireId: doc.id,
                ...(doc.data() as Omit<PlannedMeal, 'fireId'>),
            }));

            console.log(`retrieved ${meals.length} planned meals`);
            return meals;
        }
        catch (e: any) {
            console.error(`error getting planned meals: ${e}`);
            throw e;
        }
    },

    async getPlannedMealsById(userId: string, fireId: string): Promise<PlannedMeal | null> {
        try {
            const plannedMealsDoc = await firestore()
                .collection('Users')
                .doc(userId)
                .collection('plannedMeals')
                .doc(fireId)
                .get();

            if (!plannedMealsDoc.exists) {
                console.log(`planned meal ${fireId} not found`);
                return null;
            }
            
            const meal: PlannedMeal = {
                fireId: plannedMealsDoc.id,
                ...(plannedMealsDoc.data() as Omit<PlannedMeal, 'fireId'>),
            };

            console.log(`retrieved plabned meal: ${meal.title}`);
            return meal;
        }
        catch (e: any) {
            console.error(`error getting planned meal by ID: ${e}`);
            throw e;
        }
    },

    async getPlannedMealsForDate(userId: string, date: string): Promise<PlannedMeal[]> {
        try {
            const plannedMealsSnapshot = await firestore()
                .collection('Users')
                .doc(userId)
                .collection('plannedMeals')
                .where('date', '==', date)
                .orderBy('addedAt', 'asc')
                .get();

            const meals: PlannedMeal[] = plannedMealsSnapshot.docs.map(plannedMealsDoc => ({
                fireId: plannedMealsDoc.id,
                ...(plannedMealsDoc.data() as Omit<PlannedMeal, 'fireId'>),
            }));

            console.log(`retrieved ${meals.length} planned meals for ${date}`);
            return meals;
        }
        catch (e: any) {
            console.error(`error getting planned meals for date: ${e}`);
            throw e;
        }
    },

    async getPlannedMealsForWeek(userId: string, startDate: string, endDate: string): Promise<PlannedMeal[]> {
        try {
            const plannedMealSnapshot = await firestore()
                .collection('Users')
                .doc(userId)
                .collection('plannedMeals')
                .where('date', '>=', startDate)
                .where('date', '<=', endDate)
                .orderBy('date', 'asc')
                .orderBy('addedAt', 'asc')
                .get();
                
            const meals: PlannedMeal[] = plannedMealSnapshot.docs.map(plannedMealDoc => ({
                fireId: plannedMealDoc.id,
                ...(plannedMealDoc.data() as Omit<PlannedMeal, 'fireId'>),
            }));

            console.log(`retrieved ${meals.length} planned meals from ${startDate} to ${endDate}`);
            return meals;    
        }
        catch (e: any) {
            console.error(`error getting planned meals for date range: ${e}`);
            throw e;
        }
    },

    async moveMealToDate(userId: string, fireId: string, newDate: string): Promise<void> {
        try {
            await firestore()
                .collection('Users')
                .doc(userId)
                .collection('plannedMeals')
                .doc(fireId)
                .update({
                    date: newDate,
                });

            console.log(`moved meal ${fireId} to ${newDate}`);
        }
        catch (e: any) {
            console.log(`error moving meal to date: ${e}`);
            throw e;
        }
    },

    async updateMealDate(userId: string, fireId: string, newDate: string): Promise<void> {
        try {
            await firestore()
                .collection('Users')
                .doc(userId)
                .collection('plannedMeals')
                .doc(fireId)
                .update({
                    date: newDate,
                });
            
            console.log(`updated meal ${fireId} date to ${newDate}`);
        }
        catch (e: any) {
            console.log(`error updating meal date: ${e}`);
            throw e;
        }
    },

    async clearMealsForDate(userId: string, date: string): Promise<void> {
        try {
            const plannedMealsSnapshot = await firestore()
                .collection('Users')
                .doc(userId)
                .collection('plannedMeals')
                .where('date', '==', date)
                .get();

            const batch = firestore().batch();
            plannedMealsSnapshot.docs.forEach(plannedMealsDoc => {
                batch.delete(plannedMealsDoc.ref);
            });

            await batch.commit();
            console.log(`cleared ${plannedMealsSnapshot.docs.length} meals for ${date}`);
        }
        catch (e: any) {
            console.error(`error clearing meals for date: ${e}`);
            throw e;
        }
    },

    async clearAllPlannedMeals(userId: string): Promise<void> {
        try {
            const plannedMealsSnapshot = await firestore()
                .collection('Users')
                .doc(userId)
                .collection('plannedMeals')
                .get();
            
            const batch = firestore().batch();
            plannedMealsSnapshot.docs.forEach(plannedMealDocs => {
                batch.delete(plannedMealDocs.ref);
            });

            await batch.commit();
            console.log(`cleared ${plannedMealsSnapshot.docs.length} meals`);
        }
        catch (e: any) {
            console.error(`error clearing all planned meals: ${e}`);
            throw e;
        }
    },

    async getMealsByRecipeId(userId: string, recipeId: string): Promise<PlannedMeal[]> {
        try {
            const plannedMealsSnapshot = await firestore()
                .collection('Users')          
                .doc(userId)
                .collection('plannedMeals')
                .where('recipeId', '==', recipeId)
                .orderBy('date', 'asc')
                .get();
            
            const meals: PlannedMeal[] = plannedMealsSnapshot.docs.map(plannedMealDoc => ({
                fireId: plannedMealDoc.id,
                ...(plannedMealDoc.data() as Omit<PlannedMeal, 'fireId'>),
            }));

            console.log(`found ${meals.length} instance sof recipe ${recipeId}`);
            return meals;
        }
        catch (e: any) {
            console.error(`error getting meals by recipe Id: ${e}`);
            throw e;
        }
    },
};