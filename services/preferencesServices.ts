import firestore from '@react-native-firebase/firestore';

export interface Preferences {
  dietary?: string[];
  allergies?: string[];
  cuisines?: string[];
  kitchenware?: string[]; 
  dislikes?: string[];
  cookingpref?: string[];
}

export const preferenceServices = {
  async updatePreferences(userId: string, preferences: Preferences): Promise<void> {
    try {
      const batch = firestore().batch();
      const preferencesColl = firestore()
        .collection('Users')
        .doc(userId)
        .collection('preferences');

      if (preferences.dietary !== undefined) {
        batch.set(preferencesColl.doc('dietary'), {
          items: preferences.dietary,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      }

      if (preferences.allergies !== undefined) {
        batch.set(preferencesColl.doc('allergies'), {
          items: preferences.allergies,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      }

      if (preferences.cuisines !== undefined) {
        batch.set(preferencesColl.doc('cuisines'), {
          items: preferences.cuisines,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      }

      if (preferences.kitchenware !== undefined) {
        batch.set(preferencesColl.doc('kitchenware'), {
          items: preferences.kitchenware,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      }

      if (preferences.dislikes !== undefined) {
        batch.set(preferencesColl.doc('dislikes'), {
          items: preferences.dislikes,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      }

      if (preferences.cookingpref !== undefined) {
        batch.set(preferencesColl.doc('cookingpref'), {
          items: preferences.cookingpref,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      }

      await batch.commit();
      console.log(`updated preferences: ${preferences}`);
    }
    catch (e: any) {
      console.error(`error updating preferences ${e}`);
      throw e;
    }
  },
  
  async addDietary(userId: string, preference: string): Promise<void> {
    try {
      const trimmedPreference = preference.trim();
      
      if (!trimmedPreference) { throw new Error('dietary preference cannot be empty'); }

      await firestore()
        .collection('Users')
        .doc(userId)
        .collection('preferences')
        .doc('dietary')
        .update({
          'items': firestore.FieldValue.arrayUnion(trimmedPreference),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      console.log(`added dietary preference: ${trimmedPreference}`);
    }
    catch (e: any) {
      console.error(`error adding dietary preference: ${e}`);
      throw e;
    }
  },

  async removeDietary(userId: string, preference: string): Promise<void> {
    try {
      await firestore()
        .collection('Users')
        .doc(userId)
        .collection('preferences')
        .doc('dietary')
        .update({
          'items': firestore.FieldValue.arrayRemove(preference),
          updatedAt: firestore.FieldValue.serverTimestamp()
        });
      console.log(`removed dietary preference: ${preference}`);
    }
    catch (e: any) {
      console.error(`error removing dietary preference: ${e}`);
      throw e;
    }
  },

  async addAllergies(userId: string, allergies: string): Promise<void> {
    try {
      const trimmedAllergy = allergies.trim();
      
      if (!trimmedAllergy) { throw new Error('allergy preference cannot be empty'); }

      await firestore()
        .collection('Users')
        .doc(userId)
        .collection('preferences')
        .doc('allergies')
        .update({
          'items': firestore.FieldValue.arrayUnion(trimmedAllergy),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      console.log(`added dietary preference: ${trimmedAllergy}`);
    }
    catch (e: any) {
      console.error(`error adding allergy preference: ${e}`);
      throw e;
    }
  },

  async removeAllergies(userId: string, allergies: string): Promise<void> {
    try {
      await firestore()
        .collection('Users')
        .doc(userId)
        .collection('preferences')
        .doc('allergies')
        .update({
          'items': firestore.FieldValue.arrayRemove(allergies),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      console.log(`removed dietary preference: ${allergies}`);
    }
    catch (e: any) {
      console.error(`error removing dietary preference: ${e}`);
      throw e;
    }
  },

  async addCuisines(userId: string, cuisines: string): Promise<void> {
    try {
      const trimmedCuisines = cuisines.trim();
      
      if (!trimmedCuisines) { throw new Error('cuisines preference cannot be empty'); }

      await firestore()
        .collection('Users')
        .doc(userId)
        .collection('preferences')
        .doc('cuisines')
        .update({
          'items': firestore.FieldValue.arrayUnion(trimmedCuisines),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      console.log(`added cuisines preference: ${trimmedCuisines}`);
    }
    catch (e: any) {
      console.error(`error adding cuisines preference: ${e}`);
      throw e;
    }
  },

  async removeCuisines(userId: string, cuisines: string): Promise<void> {
    try {
      await firestore()
        .collection('Users')
        .doc(userId)
        .collection('preferences')
        .doc('cuisines')
        .update({
          'items': firestore.FieldValue.arrayRemove(cuisines),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      console.log(`removed dietary preference: ${cuisines}`);
    }
    catch (e: any) {
      console.error(`error removing cuisines preference: ${e}`);
      throw e;
    }
  },

  async addKitchenware(userId: string, kitchenware: string): Promise<void> {
    try {
      const trimmedKitchenware = kitchenware.trim();
      
      if (!trimmedKitchenware) { throw new Error('kitchenware preference cannot be empty'); }

      await firestore()
        .collection('Users')
        .doc(userId)
        .collection('preferences')
        .doc('kitchenware')
        .update({
          'items': firestore.FieldValue.arrayUnion(trimmedKitchenware),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      console.log(`added kitchenware preference: ${trimmedKitchenware}`);
    }
    catch (e: any) {
      console.error(`error adding kitchenware preference: ${e}`);
      throw e;
    }
  },

  async removeKitchenware(userId: string, kitchenware: string): Promise<void> {
    try {
      await firestore()
        .collection('Users')
        .doc(userId)
        .collection('preferences')
        .doc('kitchenware')
        .update({
          'items': firestore.FieldValue.arrayRemove(kitchenware),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      console.log(`removed dietary preference: ${kitchenware}`);
    }
    catch (e: any) {
      console.error(`error removing kitchenware preference: ${e}`);
      throw e;
    }
  },
  
  async addDislikes(userId: string, dislikes: string): Promise<void> {
    try {
      const trimmedDislikes = dislikes.trim();
      
      if (!trimmedDislikes) { throw new Error('dislikes preference cannot be empty'); }

      await firestore()
        .collection('Users')
        .doc(userId)
        .collection('preferences')
        .doc('dislikes')
        .update({
          'items': firestore.FieldValue.arrayUnion(trimmedDislikes),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      console.log(`added dislikes preference: ${trimmedDislikes}`);
    }
    catch (e: any) {
      console.error(`error adding dislikes preference: ${e}`);
      throw e;
    }
  },

  async removeDislikes(userId: string, dislikes: string): Promise<void> {
    try {
      await firestore()
        .collection('Users')
        .doc(userId)
        .collection('preferences')
        .doc('dislikes')
        .update({
          'items': firestore.FieldValue.arrayRemove(dislikes),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      console.log(`removed dislikes preference: ${dislikes}`);
    }
    catch (e: any) {
      console.error(`error removing dislikes preference: ${e}`);
      throw e;
    }
  },

  async addCookingPref(userId: string, cookingpref: string): Promise<void> {
    try {
      const trimmedCookingPref = cookingpref.trim();
      
      if (!trimmedCookingPref) { throw new Error('cooking preference cannot be empty'); }

      await firestore()
        .collection('Users')
        .doc(userId)
        .collection('preferences')
        .doc('cookingpref')
        .update({
          'items': firestore.FieldValue.arrayUnion(trimmedCookingPref),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      console.log(`added dislikes preference: ${trimmedCookingPref}`);
    }
    catch (e: any) {
      console.error(`error adding cooking preference: ${e}`);
      throw e;
    }
  },

  async removeCookingPref(userId: string, cookingpref: string): Promise<void> {
    try {
      await firestore()
        .collection('Users')
        .doc(userId)
        .collection('preferences')
        .doc('cookingpref')
        .update({
          'items': firestore.FieldValue.arrayRemove(cookingpref),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      console.log(`removed cooking preference: ${cookingpref}`);
    }
    catch (e: any) {
      console.error(`error removing cooking preference: ${e}`);
      throw e;
    }
  },

  async getPreferences(userId: string): Promise<Preferences> {
    try {
      const preferencesSnapshot = await firestore()
        .collection('Users')
        .doc(userId)
        .collection('preferences')
        .get();

      const preferences: Preferences = {};

      preferencesSnapshot.forEach(pref => {
        const itemArray = pref.data();
        const prefType = pref.id as keyof Preferences;
        preferences[prefType] = itemArray.items || [];
      });

      console.log(`retreived preferences for user ${userId}`);
      return preferences;
    }
    catch (e: any) {
      console.error(`error getting preferences: ${e}`);
      throw e;
    }
  },

  async initializePreferences(userId: string): Promise<void> {
    try {
      const batch = firestore().batch();
      const preferencesColl = firestore()
        .collection('Users')
        .doc(userId)
        .collection('preferences')

      const preferenceTypes = ['dietary', 'allergies', 'cuisines', 'kitchenware', 'dislikes', 'cookingpref'];

      preferenceTypes.forEach(prefType => {
        batch.set(preferencesColl.doc(prefType), {
          items: [],
          addedAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      });

      await batch.commit();
      console.log(`initialized preferences for user ${userId}`);
    }
    catch (e: any) {
      console.error(`error initializing preferences: ${e}`);
      throw e;
    }
  },

  async clearPreferenceType(userId: string, preferenceType: keyof Preferences): Promise<void> {
    try {
      await firestore()
        .collection('Users')
        .doc(userId)
        .collection('preferences')
        .doc(preferenceType)
        .update({
          items: [],
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      
        console.log(`cleared ${preferenceType} preferences for user ${userId}`);
    }
    catch (e: any) {
      console.error(`error clearing ${preferenceType} preferences: ${e}`);
      throw e;
    }
  },
}