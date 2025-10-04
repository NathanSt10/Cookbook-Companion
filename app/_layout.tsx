import { Stack } from "expo-router";
import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppStack() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

function AuthStack() {
  return (
    <Stack>
      <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
    </Stack>
  );
}

function RootContent() {
  const { user, initializing } = useAuth();

  if (initializing) return null; // or a loading indicator

  return user ? <AppStack /> : <AuthStack />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootContent />
    </AuthProvider>
  );
}
