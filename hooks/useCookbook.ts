import firestore from '@react-native-firebase/firestore';
import { useEffect, useState } from 'react';
import { getFinishItRecipes, getForYouRecipes, getRandomRecipes, getSimilarRecipes, SpoonacularRecipe, } from '../app/api/spoonacular';
import { useAuth } from '../app/context/AuthContext';
import { usePantry } from './usePantry';
import { usePreferences } from './usePreferences';

interface Recipe {
  id: number;
  title: string;
  image: string;
  cookTime: number;
  usedIngredientCount?: number;
  missedIngredientCount?: number;
}

export interface PersonalizedRecipes {
  forYou: Recipe[];
  finishIt: Recipe[];
  similar: Recipe[];
  recentlyViewed: Recipe[];
  random: Recipe[];
  cookbook: Recipe[];
}

const EMPTY_RECIPES: PersonalizedRecipes = {
  forYou: [],
  finishIt: [],
  similar: [],
  recentlyViewed: [],
  random: [],
  cookbook: [],
};

function mapFromSpoonacular(raw: SpoonacularRecipe[]): Recipe[] {
  return raw.map((r) => ({
    id: r.recipeId,
    title: r.title,
    image: r.image ?? '',
    cookTime: typeof r.cookTime === 'number' ? r.cookTime : 0,
    usedIngredientCount: r.usedIngredientCount,
    missedIngredientCount: r.missedIngredientCount,
  }));
}

export function useCookbook() {
  const { user } = useAuth();
  const { pantry, loading: pantryLoading } = usePantry();
  const { item: preferences, loading: preferencesLoading } = usePreferences();

  const [recipes, setRecipes] = useState<PersonalizedRecipes>(EMPTY_RECIPES);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const pantryLength = pantry.length;
  const pantryItems = JSON.stringify(pantry.map(item => item.name).sort());
  const preferencesList = JSON.stringify({
    dietary: preferences.dietary.sort(),
    cuisines: preferences.cuisines.sort(),
    dislikes: preferences.dislikes?.sort() || [],
    allergies: preferences.allergies?.sort() || [],
    cookingpref: preferences.cookingpref?.sort() || [],
  });

  useEffect(() => {
    if (!user) {
      setRecipes(EMPTY_RECIPES);
      setLoading(false);
      return;
    }

    if (pantryLoading || preferencesLoading) { return; }

    const fetchCookbook = async () => {
      setLoading(true);
      setError(null);

      try {

        const cookbookData = await firestore()
          .collection('Users')
          .doc(user.uid)
          .collection('recipes')
          .get();
        const cookbook: Recipe[] = cookbookData.docs.map((doc) => {
          const data = doc.data();
          return {
            id: data.id,
            title: data.title,
            image: data.image,
            cookTime: data.readyInMinutes || data.cookingMinutes || 0,
          };
        });
        
        const forYouData = await getForYouRecipes({
          preferences,
          pantry,
          number: 12,
        });
        const forYou = mapFromSpoonacular(forYouData);

        const finishItData = await getFinishItRecipes({
          pantry,
          number: 12,
        });
        const finishIt = mapFromSpoonacular(finishItData);

        const randomData = await getRandomRecipes(12);
        const random = mapFromSpoonacular(randomData);

        console.log('fetching recentlyViewed from firestore')
        const recentSnap = await firestore()
          .collection('Users')
          .doc(user.uid)
          .collection('recentlyViewed')
          .orderBy('viewedAt', 'desc')
          .limit(20)
          .get();

        console.log('number of recently viewed recipes:', recentSnap.docs.length);
        
        const recentlyViewed: Recipe[] = recentSnap.docs.map((doc) => {
          const data: any = doc.data();
          return {
            id: data.id,
            title: data.title,
            image: data.image,
            cookTime: data.cookTime ?? 0,
          };
        });

        let similar: Recipe[] = [];
        if (recentlyViewed.length > 0) {
          const base = recentlyViewed[0];
          const similarRaw = await getSimilarRecipes({
            baseRecipeId: base.id,
            number: 10,
          });
          similar = mapFromSpoonacular(similarRaw);
        }

        setRecipes({
          forYou,
          finishIt,
          similar,
          recentlyViewed,
          random,
          cookbook
        });
      } 
      catch (e: any) {
        console.error(`error fetching personalized recipes:\n${e}`);
        setError(e);
      } 
      finally {
        setLoading(false);
      }
    };

    fetchCookbook();
  }, [user, pantryLoading, preferencesLoading, pantryLength, pantryItems, preferencesList]);

  return { recipes, loading, error };
}