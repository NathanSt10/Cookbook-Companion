import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const onLogin = async () => {
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace("/");
    } catch (e: any) {
      if (!email && !password) {
        Alert.alert("Please enter valid email and password!");
      } else if (!email) {
        Alert.alert("Please enter valid email!");
        return;
      } else if (!password) {
        Alert.alert("Please enter pasword!");
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cookbook Companion</Text>

      <TextInput
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        placeholder="Email"
        placeholderTextColor={"black"}
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        secureTextEntry
        autoCapitalize="none"
        placeholder="Password"
        placeholderTextColor={"black"}
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <Pressable
        onPress={onLogin}
        disabled={loading}
        style={styles.continueButton}
      >
        <Text style={styles.continueButtonText}>Login</Text>
      </Pressable>

      <Text style={styles.orHeader}>-----or-----</Text>

      <TouchableOpacity style={styles.socialButton}>
        <Text style={styles.socialButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton}>
        <Text style={styles.socialButtonText}>Continue with Apple</Text>
      </TouchableOpacity>

      <Link href="/signup">No account? Sign up here</Link>
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
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
});
// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//   Button,
//   KeyboardAvoidingView,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from "react-native";
// import { useAuth } from "../context/AuthContext";

// export default function Login() {
//   const { signIn } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState<string | null>(null);

//   const handleSignIn = async () => {
//     try {
//       setError(null);
//       await signIn(email.trim(), password);
//       // auth state change will switch the UI to the protected stack
//     } catch (e: any) {
//       setError(e.message || "Failed to sign in");
//     }
//   };
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       <KeyboardAvoidingView behavior="padding">
//         <Text style={styles.title}>Sign in</Text>
//         {!!error && <Text style={styles.error}>{error}</Text>}
//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           placeholderTextColor={"#000000ff"}
//           value={email}
//           onChangeText={setEmail}
//           autoCapitalize="none"
//           keyboardType="email-address"
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           placeholderTextColor={"#000000ff"}
//           value={password}
//           onChangeText={setPassword}
//           autoCapitalize="none"
//           secureTextEntry
//         />
//         <Button title="Sign in" onPress={handleSignIn} />
//         <View style={{ height: 12 }} />
//         <Button
//           title="Create account"
//           onPress={() => router.push("/(auth)/signup")}
//         />
//       </KeyboardAvoidingView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", padding: 20 },
//   input: {
//     color: "black",
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 8,
//     marginBottom: 12,
//     borderRadius: 6,
//   },
//   title: { fontSize: 24, marginBottom: 12, textAlign: "center" },
//   error: { color: "red", marginBottom: 8 },
// });
