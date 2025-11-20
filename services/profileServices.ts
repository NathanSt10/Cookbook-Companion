import firestore from '@react-native-firebase/firestore';
import { ProfileUpdate, ProfileUpdateFields } from '../hooks/useProfile';

export const profileServices = {
  async updateFirstName(userId: string, firstName: string): Promise<void> {
    try {
      const trimmedFirst = firstName.trim();

      if (!trimmedFirst) { throw new Error('First name cannot be empty'); }

      await firestore()
        .collection('Users')
        .doc(userId)
        .update({
          firstName: trimmedFirst,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      console.log(`first name updated to: ${trimmedFirst}`);
    }
    catch (e: any) {
      console.error(`Error updating first name ${e}`);
      throw e;
    }
  },

  async updateLastName(userId: string, lastName: string): Promise<void> {
    try {
      const trimmedLast = lastName.trim();

      if (!trimmedLast) { throw new Error('Last name cannot be empty'); }

      await firestore()
        .collection('Users')
        .doc(userId)
        .update({
          lastName: trimmedLast,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      console.log(`last name updated to: ${trimmedLast}`);
    }
    catch (e: any) {
      console.error(`Error updating last name ${e}`);
      throw e;
    }
  },

  async updateEmail(userId: string, email: string): Promise<void> {
    try {
      const trimmedEmail = email.trim().toLowerCase();

      if (!trimmedEmail) { throw new Error("Email can't be empty"); }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) { throw new Error('Invalid email format'); }

      await firestore()
        .collection('Users')
        .doc(userId)
        .update({
          email: trimmedEmail,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      console.log(`email updated to: ${trimmedEmail}`);
    }
    catch (e: any) {
      console.error(`error updating email ${e}`);
      throw e;
    }
  },

  async updateProfile(userId: string, updates: ProfileUpdateFields): Promise<void> {
    try {
      const cleanUpdates: any = {
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      if (updates.firstName !== undefined) {
        const trimmedFirstName = updates.firstName?.trim();
        if (!trimmedFirstName) {
          throw new Error('First name cannot be empty');
        }
        cleanUpdates.firstName = trimmedFirstName;
      }

      if (updates.lastName !== undefined) {
        const trimmedLastName = updates.lastName?.trim();
        if (!trimmedLastName) {
          throw new Error('Last name cannot be empty');
        }
        cleanUpdates.lastName = trimmedLastName;
      }

      if (updates.email !== undefined) {
        const trimmedEmail = updates.email?.trim().toLowerCase();
        if (!trimmedEmail) {
          throw new Error('Email cannot be empty');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
          throw new Error('Invalid email format');
        }
        cleanUpdates.email = trimmedEmail;
      }

      await firestore()
        .collection('Users')
        .doc(userId)
        .update(cleanUpdates);
      console.log(`first name updated to ${updates.firstName}\nlast name update to ${updates.lastName}\nemail updated to ${updates.email}`);
    }
    catch (e: any) {
      console.error(`error updating profile ${e}`);
      throw e;
    }
  },

  async getProfile(userId: string): Promise<any> {
    try {
      const profileDoc = await firestore()
        .collection('Users')
        .doc(userId)
        .get();

      if (!profileDoc.exists) { throw new Error ('User profile not found'); }
      return profileDoc.data();
    } 
    catch (e: any) {
      console.error(`error getting profile: ${e}`);
      throw e;
    }
  },

  async createProfile(userId: string, profileData: ProfileUpdate): Promise<void> {
    try {
      await firestore()
        .collection('Users')
        .doc(userId)
        .set({
          firstName: profileData.firstName?.trim(),
          lastName: profileData.lastName?.trim(),
          email: profileData.email?.trim().toLowerCase(),
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      console.log(`Profile created successfully for user: ${profileData.firstName} ${profileData.lastName}`);
    }
    catch (e: any) {
      console.error(`error creating profile ${e}`);
      throw e;
    }
  }
};