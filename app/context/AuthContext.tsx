import type { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  initializing: boolean;
  signUp: (email: string, password: string) => Promise<FirebaseAuthTypes.UserCredential>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const authInstance = getAuth();

  useEffect(() => {
    const subscriber = onAuthStateChanged(authInstance, (usr) => {
      setUser(usr);
      if (initializing) setInitializing(false);
    });

    return subscriber; // unsubscribe on unmount
  }, [authInstance, initializing]);

  const signUp = async (email: string, password: string): Promise<FirebaseAuthTypes.UserCredential> => {
    return await createUserWithEmailAndPassword(authInstance, email, password);
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(authInstance, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(authInstance);
  };

  return (
    <AuthContext.Provider
      value={{ user, initializing, signUp, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export default AuthContext;
