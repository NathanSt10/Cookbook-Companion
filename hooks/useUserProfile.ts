import { doc, getDoc, getFirestore } from "@react-native-firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../app/context/AuthContext";

export type Preferences = {
  dietary?: string[];
  cuisines?: string[];
  [key: string]: any;
};

export function useUserProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const db = getFirestore();

  const fetchUserData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const userDoc = await getDoc(doc(db, "Users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (!data) return;
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setPreferences(data.preferences || null);
      } else {
        // no doc found
        setFirstName("");
        setLastName("");
        setPreferences(null);
      }
    } catch (e: any) {
      setError(e);
      console.error("useUserProfile: error fetching user data", e);
    } finally {
      setLoading(false);
    }
  }, [user, db]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    loading,
    firstName,
    lastName,
    preferences,
    error,
    refresh: fetchUserData,
  } as const;
}
