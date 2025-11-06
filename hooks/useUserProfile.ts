import firestore from '@react-native-firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../app/context/AuthContext';

export interface ProfileProps {
  firstName: string;
  lastName: string;
  email: string;
}

export type Preferences = {
  dietary?: string[];
  allergies?: string[];
  cuisines?: string[];
  kitchware?: string[];
  dislikes?: string[];
  cookingpref?: string[];
  [key: string]: any;
}

export interface Recipe {
  fireId: string;
  recipeId: string;
  title: string;
  image: string;
  addedAt?: Date;
}

export interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  preferences: Preferences | null;
  likedRecipes: Recipe[];
  savedRecipes: Recipe[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function useUserProfile(): UserProfileData {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [likedRecipes, setLikedRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserData = useCallback(async () => {
    if (!user) { return; }
    setLoading(true);
    setError(null);

    try {
      const userDoc = await firestore()
        .collection('Users')
        .doc(user.uid)
        .get();
      console.log("fetched user doc: ", userDoc);

      const data = userDoc.data();
      if (data) {
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
        setEmail(data.email || '');
        setPreferences(data.preferences || null);   

        console.log("profile loaded: ", data.firstName);
      }
      else {
        console.error("No user doc: ", userDoc);
        setFirstName("");
        setLastName("");
        setEmail("");
        setPreferences(null);
      }
      
      try {
        const likedSnapshot = await firestore()
          .collection('Users')
          .doc(user.uid)
          .collection('likedRecipes')
          .orderBy('addedAt', 'desc')
          .get()
        console.log("fetched liked recipes: ", likedSnapshot.size);

        const likedRecipesData: Recipe[] = likedSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            fireId: doc.id,
            recipeId: doc.data().recipeId,
            title: doc.data().title,
            image: doc.data().image,
            addedAt: doc.data().addedAt?.toDate(),
          };
        });
        setLikedRecipes(likedRecipesData);
      }
      catch (e: any) {
        console.error("couldn't fetch liked recipes");
        setLikedRecipes([]);
      };
      
      try {
        const savedSnapshot = await firestore()
          .collection('Users')
          .doc(user.uid)
          .collection('savedRecipes')
          .orderBy('addedAt')
          .get()
        console.log("fetched saved recipes: ", savedSnapshot.size);
      
        const savedRecipesData: Recipe[] = savedSnapshot.docs.map(doc => {
          const data = doc.data();
          return {  
            fireId: doc.id,
            recipeId: doc.data().recipeId,
            title: doc.data().title,
            image: doc.data().image,
            addedAt: doc.data().addedAt?.toDate(),
          };
        });
        setSavedRecipes(savedRecipesData);
      }
      catch (e: any) {
        console.error("could'nt fetch saved recipes");
        setSavedRecipes([]);
      };
    }
    catch (e: any) {
      setError(e);
      console.error('useUserProfile: error fetching user data', e);
    }
    finally {
      setLoading(false);
      console.log("fetched profile completed");
    }
  }, [user])

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    firstName, 
    lastName, 
    email,
    preferences,
    likedRecipes,
    savedRecipes,
    loading,
    error,
    refresh: fetchUserData,
  };
}