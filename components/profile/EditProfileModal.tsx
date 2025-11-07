import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import HeaderFormatFor from "../../components/HeaderFormatFor";
import { useAuth } from "../../app/context/AuthContext";
import { useUserProfile } from "../../hooks/useUserProfile";
import { userProfileServices } from "@/services/userProfileServices";

interface EditProfileModalProps {
  onClose: () => void;
}

export default function EditProfile( { onClose }: EditProfileModalProps) {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState<Boolean>(false);
  const { firstName: currentFirstName, lastName: currentLastName, email: currentEmail, refresh } = useUserProfile();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    setFirstName(currentFirstName ?? "");
    setLastName(currentLastName ?? "");
    setEmail(currentEmail ?? "");
  }, [currentFirstName, currentLastName, currentEmail]);

  const handleSave = async () => {
    const update = {
      firstName: (firstName || "").trim(),
      lastName: (lastName || "").trim(),
      email: (email || "").trim(),
    };

    const curr = {
      firstName: (currentFirstName || "").trim(),
      lastName: (currentLastName || "").trim(),
      email: (currentEmail || "").trim(),
    };

    const nothing = 
      update.firstName === curr.firstName &&
      update.lastName === curr.lastName &&
      update.email === curr.email;

    if (nothing) {
      onClose();
      return;
    }
    
    if (!user) {
      Alert.alert("Error", "Not signed in");
      console.error("user not signed in");
      return;
    }

    try {
      setLoading(true);
      await userProfileServices.updateProfile(user.uid, update);
      await refresh();
      onClose();
    } catch (e) {
      Alert.alert("Save failed", "Couldn't save profile changes.  Try again.")
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    try {
      setLoading(true);
      onClose();
    }
    catch (e) {
      console.error("error: ", e);
    }
    finally {
      setLoading(false);
    }
  }

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
    }
    catch (e: any) {
      console.log("Error: ", e);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderFormatFor page="Edit Profile" />

      <Text style={styles.label}>Email</Text>
      <TextInput 
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />

      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="First Name"
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Last Name"
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleSave}
      >
        <Text style={styles.buttonText}>
          {loading ? "Saving..." : "Save Changes"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleCancel}
      >
        <Text style={styles.buttonText}>
          {loading ? "Canceling..." : "Cancel Changes"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.signOutButton}
        onPress={handleSignOut}
      >
        <Text style={styles.signOutText}>{loading ? "Standby..." : "Sign Out"}</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "whitesmoke",
    padding: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: "black",
    marginBottom: 6,
    marginLeft: 4,
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
    elevation: 10,
  },
  cancelButton: { 
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    elevation: 10,
  },
  cancelButtonText: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  signOutButton: {
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    backgroundColor: "gainsboro",
    elevation: 5,
    shadowRadius: 5,
    shadowColor: 'black',
    shadowOpacity: 40,
  },
  signOutText: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});
