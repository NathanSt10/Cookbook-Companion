import firestore from '@react-native-firebase/firestore';

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
    
    console.log(`do something about preferences storage`);
  },

  async addDietaryPreference(userId: string, preference: string): Promise<void> {
    await firestore()
      .collection('Users')
      .doc(userId)
      .update({
        'preferences.dietary': preference,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    
    console.log(`should be it?`);
  },

  async removeDietaryPreference(userId: string, preference: string): Promise<void> {
    await firestore()
      .collection('Users')
      .doc(userId)
      .update({
        'preferences.dietary': preference,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    
    console.log(`testing remove diet`);
  },

  async addAllergy(userId: string, allergy: string): Promise<void> {
    await firestore()
      .collection('Users')
      .doc(userId)
      .update({
        'preferences.allergies': allergy,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    
    console.log(`testing add allergy`);
  },

  async removeAllergy(userId: string, allergy: string): Promise<void> {
    await firestore()
      .collection('Users')
      .doc(userId)
      .update({
        'preferences.allergies': allergy,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    
    console.log(`testing remove allegy`);
  },

  async addCuisine(userId: string, cuisine: string): Promise<void> {
    await firestore()
      .collection('Users')
      .doc(userId)
      .update({
        'preferences.cuisines': cuisine,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    
    console.log('testing add cuisine');
  },

  async removeCuisine(userId: string, cuisine: string): Promise<void> {
    await firestore()
      .collection('Users')
      .doc(userId)
      .update({
        'preferences.cuisines': cuisine,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    
    console.log('cuisine removal');
  },

  async addKitchenware(userId: string, item: string): Promise<void> {
    await firestore()
      .collection('Users')
      .doc(userId)
      .update({
        'preferences.kitchware': item,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    
    console.log(`add kitchenware test`);
  },

  async removeKitchenware(userId: string, item: string): Promise<void> {
    await firestore()
      .collection('Users')
      .doc(userId)
      .update({
        'preferences.kitchware': item,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    
    console.log(`remove kitchenware test`);
  },
};