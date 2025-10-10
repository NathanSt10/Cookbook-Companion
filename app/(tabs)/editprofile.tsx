import { doc, getFirestore, updateDoc } from "@react-native-firebase/firestore";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useAuth } from "../context/AuthContext";

export default function EditProfile() {
  const { user } = useAuth();
  const db = getFirestore();
  const {
    firstName: profileFirstName,
    lastName: profileLastName,
    refresh,
  } = useUserProfile();

  const [firstName, setFirstName] = useState(profileFirstName || "");
  const [lastName, setLastName] = useState(profileLastName || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFirstName(profileFirstName || "");
  }, [profileFirstName]);

  useEffect(() => {
    setLastName(profileLastName || "");
  }, [profileLastName]);

  const handleSave = async () => {
    if (!user) {
      Alert.alert("Error", "No user is logged in.");
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Missing Info", "Please enter both first and last name.");
      return;
    }

    try {
      setLoading(true);

      await updateDoc(doc(db, "Users", user.uid), {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      } as any);

      // refresh the hook data
      await refresh();

      Alert.alert("Success", "Profile updated!");
      router.back();
    } catch (e) {
      console.error("Error updating profile:", e);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="First Name"
      />
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Last Name"
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Saving..." : "Save Changes"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "black",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});
