import { SplashScreen } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function SplashScreenController() {
  const { initializing } = useAuth();

  if (!initializing) {
    SplashScreen.hideAsync();
  }

  return null;
}
