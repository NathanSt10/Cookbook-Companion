import firestore from '@react-native-firebase/firestore';
import { useCallback, useEffect, useState, } from 'react';
import { useAuth } from '../app/context/AuthContext';

export interface ProfileUpdate {
  firstName: string;
  lastName: string;
  email: string;
}

export interface ProfileUpdateFields {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const refresh = useCallback(async () => {
    if (!user) { return; }
    setLoading(true); 
    setError(null);

    try {
      const profileDoc = await firestore()
        .collection("Users")
        .doc(user.uid)
        .get();

      const profile = profileDoc.data(); 
      if (profile) {
        setEmail(profile.email);
        setFirstName(profile.firstName);
        setLastName(profile.lastName);
        console.log(`fetched ${profile.firstName}`);
      }
      else {
        setEmail("");
        setFirstName("");
        setLastName("");
      }
    }
    catch (e: any) {
      setError(e); 
      console.log(`useProfile refresh error: ${e}`);
    }
    finally {
      setLoading(false);
    }
  }, [user]);
  
  useEffect(() => {
    if (!user) { return; }
    setLoading(true);
    setError(null);

    const unsubscribe = firestore()
      .collection('Users')
      .doc(user.uid)
      .onSnapshot(
        (onResult) => {
          const profile = onResult.data();
          if (profile) {
            setEmail(profile.email || "");
            setFirstName(profile.firstName || "");
            setLastName(profile.lastName || "");
            console.log(`${profile.firstName} has been loaded`);
          }
          else {
            setEmail(""); 
            setFirstName("");
            setLastName("");
          }
          setLoading(false);
        },
        (onError) => {
          setError(onError);
          setLoading(false);
          console.error(`useProfile error: ${onError}`);
        }
      );

      return unsubscribe;
  }, [user]);

  return {
    firstName,
    lastName,
    email,
    loading, 
    error,
    refresh,
  };
}