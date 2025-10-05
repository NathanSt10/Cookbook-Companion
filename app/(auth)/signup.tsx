import { Link, router } from "expo-router";
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import firestore from '@react-native-firebase/firestore';

export default function SignUp() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const createUser = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      await signUp(email, password);
      firestore()
        .collection('Users')
        .add({
          first_name: firstName,
          last_name: lastName,
          email: email,
          username: password
        })
        .then(() => {
          console.log('User added!');
        });

      return { success: true}
    } 
    catch (error) {
      console.error("Error creating user: ", error);
      return { success: false};
    }
  };

  const handleAuth = async () => {

    if (!email && !password && !firstName && !lastName) {
      Alert.alert("Please fill out all fields")
      return;
    }
    else if (!email) {
      Alert.alert('Please enter valid email!');
      return;
    }
    else if (!password) {
      Alert.alert('Please enter pasword!');
      return;
    }
    else if (!firstName) {
      Alert.alert('Please enter first name');
      return;
    }
    else if (!lastName) {
      Alert.alert('Please enter lastname');
      return;
    }

    const result = await createUser(email, password, firstName, lastName);
  
    if (result.success) {
      router.replace('/');
    } 
    else {
      Alert.alert('Failed to create account');
    }
  }

  const clearFields = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
  };

  return (
    <View style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>Sign up</Text>

        {/* Create account section */}
        <Text style={styles.createHeader}>Create an account</Text>
        <Text style={styles.enterEmailHeader}>Enter an email and password to sign up for this app</Text>

        {/* First name input */}
        <TextInput
            style={styles.input}
            placeholder="First name"
            placeholderTextColor={"black"}
            value={firstName}
            onChangeText={setFirstName}
        />

        {/* Lase name input */}
        <TextInput
            style={styles.input}
            placeholder="Last name"
            placeholderTextColor={"black"}
            value={lastName}
            onChangeText={setLastName}
        />

        {/* Email input */}
        <TextInput
            style={styles.input}
            placeholder="email@domain.com"
            placeholderTextColor={"black"}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
        />

        {/* Password input */}
        <TextInput
            style={styles.input}
            placeholder="password"
            placeholderTextColor={"black"}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
        />

        {/* Continue button */}
        <TouchableOpacity style={styles.continueButton} onPress={handleAuth}>
            <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>

        {/* OR Divider */}
        <Text style={styles.orHeader}>---or---</Text>

        {/* <Link style={styles.link} href="/login">Already have an account?</Link> */}

        {/* Terms */}
        <Text style={styles.terms}>
            By clicking continue, you agree to our <Text style={styles.link}>Terms of Service</Text> and <Text style={styles.link}>Privacy Policy</Text>
        </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },
  createHeader: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  enterEmailHeader: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 20,
    color: "#666",
  },
  input: {
    color: "black",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: "black",
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 20,
  },
  continueButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  orHeader: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 14,
    color: "#666",
  },
  guestHeader: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 13,
  },
  guestLink: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  socialButton: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 10,
  },
  socialButtonText: {
    textAlign: "center",
    fontSize: 16,
  },
  terms: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 12,
    color: "#666",
  },
  link: {
    textAlign: "center",
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
});