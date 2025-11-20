import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../app/context/AuthContext';

type PlannedMeal = {
  fireId: string;
  recipeId: number;
  title: string;
  image: string;
  date: string; // "YYYY-MM-DD"
  addedAt: FirebaseFirestoreTypes.Timestamp;
}

type PlannedMeals = Record<string, PlannedMeal[]>;

export function usePlannedMeals() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [plannedMeals, setPlannedMeals] = useState<PlannedMeals>({});

  const handleItemsFromSnap = useCallback((snapshot: any) => {
    console.log("handling items in calendar");
    const mealsByDate: PlannedMeals = {};

    snapshot.forEach((plannedMealsDocument: any) => {
      const field = plannedMealsDocument.data();
      console.log(`field: ${field}`);

      const meal: PlannedMeal = {
        fireId: field.id,
        recipeId: field.recipeId,
        title: field.title,
        image: field.image,
        date: field.date,
        addedAt: field.addedAt?.toDate?.() || new Date(field.addedAt),
      };
      console.log(`meal: ${meal}`);

      if (!mealsByDate[meal.date]) {
        mealsByDate[meal.date] = [];
      } 

      console.log(`meal date: ${meal.date}\npsuhing meal: ${meal}`);
      mealsByDate[meal.date].push(meal);
      console.log(`mealsByDate: ${mealsByDate}`)
    });

    return mealsByDate;
  }, []);

  const refresh = useCallback(async () => {
    if (!user) { return; }
    setLoading(true);
    setError(null);

    try {
      const snapPlannedMealsColl = await firestore()
        .collection('Users')
        .doc(user.uid)
        .collection('plannedMeals')
        .get();

      const items = handleItemsFromSnap(snapPlannedMealsColl);
      setPlannedMeals(items);
      console.log(`built planned meals ${items}`);
      setError(null);
    }
    catch (e: any) {
      setError(e);
      console.error(`usePlannedMeals refresh error: ${e}`);
    }
    finally {
      setLoading(false);
    }
  }, [user, handleItemsFromSnap]);
  
  useEffect(() => {
    console.log("using usePlannedMeals");
    if (!user) { return; }
    setLoading(true);
    setError(null);

    const unsubscribe = firestore()
      .collection('Users')
      .doc(user.uid)
      .collection('plannedMeals')
      .onSnapshot(
        (onSuccess) => {
          const items = handleItemsFromSnap(onSuccess);
          setPlannedMeals(items);
          setLoading(false);
          setError(null);
        },
        (onError) => {
          setError(onError);
          setLoading(false);
          console.error(`usePlannedMeals snapshot error: ${onError}`);
        }
      );
    
    return unsubscribe;
  }, [user, handleItemsFromSnap]);

  return {
      plannedMeals,
      loading,
      error,
      refresh,
  };      
}