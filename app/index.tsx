import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "./context/AuthContext";

export default function Index() {
  const { user, initializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initializing) return;
    if (user) {
      // navigate to the default tab screen (cookbook)
      router.replace("/(tabs)/cookbook");
    } else {
      router.replace("/(auth)/signin");
    }
  }, [user, initializing, router]);

  if (initializing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }
  
  // nothing to render because router.replace will navigate away
  return null;
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
