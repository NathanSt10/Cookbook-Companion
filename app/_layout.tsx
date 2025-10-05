import { Stack } from "expo-router";

import { SplashScreenController } from "./(auth)/splash";
import { AuthProvider, useAuth } from "./context/AuthContext";

export default function Root() {
  // Set up the auth context and render your layout inside of it.
  return (
    <AuthProvider>
      <SplashScreenController />
      <RootNavigator />
    </AuthProvider>
  );
}

// Create a new component that can access the SessionProvider context later.

function RootNavigator() {
  const { user } = useAuth();

  return (
    <Stack>
      <Stack.Protected guard={!!user}>
        {/* your main app */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />{" "}
      </Stack.Protected>

      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}