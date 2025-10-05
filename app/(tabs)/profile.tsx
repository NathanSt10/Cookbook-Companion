import { Button, Text, View } from "react-native";

import { useAuth } from "../context/AuthContext";

export default function Index() {
  const { user, signOut } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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

