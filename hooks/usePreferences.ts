import firestore from '@react-native-firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../app/context/AuthContext';

export type PreferenceKey =
    | "dietary"
    | "cuisines"
    | "kitchenware"
    | "allergies"
    | "dislikes"
    | "cookingpref";

export type PreferencesItemArray = Record<PreferenceKey, string[]>;

const KEYS: PreferenceKey[] = [
    'dietary',
    'cuisines',
    'kitchenware',
    'allergies',
    'dislikes',
    'cookingpref',
];

const EMPTY: PreferencesItemArray = {
    dietary: [],
    cuisines: [],
    kitchenware: [],
    allergies: [],
    dislikes: [],
    cookingpref: [],
};

export function usePreferences() {
    const { user } = useAuth();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [preferences, setPreferences] = useState<PreferencesItemArray>(EMPTY);

    const refresh = useCallback(async () => {
        if (!user) { return; }
        setLoading(true);
        setError(null);

        try {
            const preferencesColl = firestore()
                .collection('Users')
                .doc(user.uid)
                .collection('preferences');
                
            const snaps = await Promise.all(KEYS.map((preferences) => preferencesColl.doc(preferences).get()));
            console.log(`snaps: ${snaps}`);

            const next: PreferencesItemArray = { ...EMPTY };
            console.log(`next: ${next}: SHOULD BE EMPTY`);
            
            snaps.forEach((snap) => {
                const fireId = snap.id as PreferenceKey;
                console.log(`fireId: ${fireId}`);
                
                const items = (snap.data()?.items ?? []) as string[];
                console.log(`items: ${items}`);
                if (KEYS.includes(fireId)) {
                    next[fireId] = Array.isArray(items) ? items : [];
                    console.log(`next[fireId]: ${next[fireId]}`);
                }
            });

            setPreferences(next);
            console.log(`preferences: ${preferences}`);
        }
        catch (e: any) {
            setError(e);
            console.error(`Error refreshing preferences: ${e}`)
        }
        finally {
            setLoading(false);
        }

        console.log(`refreshed preferences: \nallergies: ${preferences.allergies}\n
            dislikes: ${preferences.dislikes}\ndietary: ${preferences.dietary}\ncookingpref: ${preferences.cookingpref}\n
            cuisines: ${preferences.cuisines}\nkitchenware: ${preferences.kitchenware}`);
    }, [user]);

    useEffect(() => {
        console.log("using usePreferences.");
        if (!user) { return; }
        setLoading(true);
        setError(null);

        const unsubscribe = firestore()
            .collection('Users')
            .doc(user.uid)
            .collection('preferences')
            .onSnapshot(
                (onResult) => {
                    const next: PreferencesItemArray = { ...EMPTY };
                    console.log(`next: ${next}`);

                    onResult.forEach((preferencesDoc) => {
                        console.log(`preferencesDoc.id: ${preferencesDoc.id}`);
                        const fireId = preferencesDoc.id as PreferenceKey;
                        if (KEYS.includes(fireId)) {
                            const items = (preferencesDoc.data()?.items ?? []) as string[];
                            console.log(`items: ${items.flat}`);
                            next[fireId] = Array.isArray(items) ? items : [];
                            console.log(`next[fireId]: ${next[fireId]}`);
                        };
                    });
                    console.log(`setting preferences: ${next}`);
                    setPreferences(next);
                    console.log(`preferences: ${preferences}`);
                    setLoading(false);
                },
                (onError) => {
                    setError(onError);
                    setLoading(false);
                }
            );

        return unsubscribe;
    }, [user]);

    return { 
        item: preferences, 
        loading, 
        error, 
        refresh 
    };
}