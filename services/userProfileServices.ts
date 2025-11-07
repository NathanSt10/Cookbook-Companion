import firestore from '@react-native-firebase/firestore';
import { Preferences } from '../hooks/useUserProfile';

export const userProfileServices = {
  async updateFirstName(userId: string, firstName: string): Promise<void> {
    await firestore()
      .collection('Users')
      .doc(userId)
      .update({
        firstName: firstName.trim(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    
    console.log(`first name updated to ${firstName}`);
  },

  async updateLastName(userId: string, lastName: string): Promise<void> {
    await firestore()
      .collection('Users')
      .doc(userId)
      .update({
        lastName: lastName.trim(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    
    console.log(`first name updated to ${lastName}`);
  },

  async updateEmail(userId: string, email: string): Promise<void> {
    await firestore()
      .collection('Users')
      .doc(userId)
      .update({
        email: email.trim(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    
    console.log(`first name updated to ${email}`);
  },

  async updateProfile(
    userId: string,
    updates: {
      firstName?: string;
      lastName?: string;
      email?: string;
    }
  ): Promise<void> {
    const cleanUpdates: any = {
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    if (updates.firstName) cleanUpdates.firstName = updates.firstName.trim();
    if (updates.lastName) cleanUpdates.lastName = updates.lastName.trim();
    if (updates.email) cleanUpdates.email = updates.email.trim();

    await firestore()
      .collection('Users')
      .doc(userId)
      .update(cleanUpdates);
    
    console.log(`first name updated to ${updates.firstName}\nlast name update to ${updates.lastName}\nemail updated to ${updates.email}`);
  },

  async updatePreferences(userId: string, preferences: Preferences): Promise<void> {
    await firestore()
      .collection('Users')
      .doc(userId)
      .update({
        preferences,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    
    console.log(`updated preferences`);
  },

  async addDietaryPreference(userId: string, preference: string): Promise<void> {
    await firestore()
      .collection('Users')
      .doc(userId)
      .update({
        'preferences.dietary': firestore.FieldValue.arrayUnion(preference),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    
    console.log(`added ${preference}`);
  },

  async removeDietaryPreference(userId: string, preference: string): Promise<void> {
    await firestore()
      .collection('Users')
      .doc(userId)
      .update({
        'preferences.dietary': firestore.FieldValue.arrayRemove(preference),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    
    console.log(`removed ${preference}`);
  },

  async addAllergy(userId: string, allergy: string): Promise<void> {
    await firestore()
      .collection('Users')
      .doc(userId)
      .update({
        'preferences.allergies': firestore.FieldValue.arrayUnion(allergy),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    
    console.log(`adding ${allergy}`);
  },

  async removeAllergy(userId: string, allergy: string): Promise<void> {
    await firestore()
      .collection('Users')
      .doc(userId)
      .update({
        'preferences.allergies': firestore.FieldValue.arrayRemove(allergy),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    
    console.log(`removed ${allergy}`);
  },

  async addCuisine(userId: string, cuisine: string): Promise<void> {
    await firestore()
      .collection('Users')
      .doc(userId)
      .update({
        'preferences.cuisines': firestore.FieldValue.arrayUnion(cuisine),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    
    console.log(`adding ${cuisine}`);
  },

  async removeCuisine(userId: string, cuisine: string): Promise<void> {
    await firestore()
      .collection('Users')
      .doc(userId)
      .update({
        'preferences.cuisines': firestore.FieldValue.arrayRemove(cuisine),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    
    console.log(`removed ${cuisine}`);
  },

  async addKitchenware(userId: string, item: string): Promise<void> {
    await firestore()
      .collection('Users')
      .doc(userId)
      .update({
        'preferences.kitchenware': firestore.FieldValue.arrayUnion(item),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    
    console.log(`adding ${item}`);
  },

  async removeKitchenware(userId: string, item: string): Promise<void> {
    await firestore()
      .collection('Users')
      .doc(userId)
      .update({
        'preferences.kitchenware': firestore.FieldValue.arrayRemove(item),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    
    console.log(`removed ${item}`);
  },
};