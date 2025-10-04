import { Button, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function Tab() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 18, marginBottom: 8 }}>Profile</Text>
      {user ? (
        <>
          <Text>{user.email}</Text>
          <View style={{ height: 12 }} />
          <Button title="Sign out" onPress={() => signOut()} />
        </>
      ) : (
        <Text>No user signed in</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
