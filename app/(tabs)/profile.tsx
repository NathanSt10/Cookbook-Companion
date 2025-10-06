import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc, getFirestore } from "@react-native-firebase/firestore";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";

type TabType = "collections" | "recipes" | "liked" | "saved" | "preferences";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [preferences, setPreferences] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>("collections");
  const db = getFirestore();
  const { user, signOut } = useAuth();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (!data) return;
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setPreferences(data.preferences || null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut();
      router.replace("/");
    } catch (e: any) {
      Alert.alert("Logout failed", e?.message ?? "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "collections":
        return (
          <View style={styles.tabContent}>
            <View style={styles.newCollection}>
              <Ionicons name="add" size={20} color="black" />
              <Text style={styles.newText}>Create new collection</Text>
              <Ionicons name="chevron-forward" size={20} color="black" />
            </View>
            <View style={styles.collectionCard}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1605478571920-74b90cda44bb",
                }}
                style={styles.collectionImage}
              />
              <Text style={styles.collectionTitle}>My Favorites</Text>
            </View>
          </View>
        );

      case "recipes":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.emptyText}>Your recipes will appear here</Text>
          </View>
        );

      case "liked":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.emptyText}>
              Your liked recipes will appear here
            </Text>
          </View>
        );

      case "saved":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.emptyText}>
              Your saved recipes will appear here
            </Text>
          </View>
        );

      case "preferences":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Dietary Preferences</Text>
            {preferences?.dietary && preferences.dietary.length > 0 ? (
              preferences.dietary.map((item: string, index: number) => (
                <View key={index} style={styles.preferenceItem}>
                  <Text style={styles.preferenceText}>{item}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No dietary preferences set</Text>
            )}

            <Text style={styles.sectionTitle}>Favorite Cuisines</Text>
            {preferences?.cuisines && preferences.cuisines.length > 0 ? (
              preferences.cuisines.map((item: string, index: number) => (
                <View key={index} style={styles.preferenceItem}>
                  <Text style={styles.preferenceText}>{item}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No cuisine preferences set</Text>
            )}

            <TouchableOpacity
              style={styles.editPreferencesButton}
              onPress={() => router.push("/preferences")}
            >
              <Text style={styles.editPreferencesText}>Edit Preferences</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Profile header */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: "https://i.pravatar.cc/300" }}
            style={styles.avatar}
          />
          <Text style={styles.name}>
            {firstName && lastName ? `${firstName} ${lastName}` : "Loading..."}
          </Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editText}>Edit profile</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => setActiveTab("collections")}>
            <Text
              style={[
                styles.tab,
                activeTab === "collections" && styles.activeTab,
              ]}
            >
              Collections
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("recipes")}>
            <Text
              style={[styles.tab, activeTab === "recipes" && styles.activeTab]}
            >
              Recipes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("liked")}>
            <Text
              style={[styles.tab, activeTab === "liked" && styles.activeTab]}
            >
              Liked
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("saved")}>
            <Text
              style={[styles.tab, activeTab === "saved" && styles.activeTab]}
            >
              Saved
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("preferences")}>
            <Text
              style={[
                styles.tab,
                activeTab === "preferences" && styles.activeTab,
              ]}
            >
              Preferences
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {renderTabContent()}

        <Pressable
          onPress={handleLogout}
          disabled={loading}
          style={styles.logButton}
        >
          <Text style={styles.logButtonText}>
            {loading ? "Logging out..." : "Logout"}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileHeader: {
    alignItems: "center",
    marginTop: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "black",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  editText: {
    color: "white",
    fontSize: 14,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 8,
  },
  tab: {
    fontSize: 14,
    color: "gray",
  },
  activeTab: {
    color: "black",
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: "black",
    paddingBottom: 8,
  },
  tabContent: {
    padding: 20,
  },
  newCollection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 20,
  },
  newText: {
    fontSize: 15,
    flex: 1,
    marginLeft: 8,
  },
  collectionCard: {
    width: 120,
  },
  collectionImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  collectionTitle: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "500",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    marginTop: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 15,
  },
  preferenceItem: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  preferenceText: {
    fontSize: 16,
  },
  editPreferencesButton: {
    backgroundColor: "black",
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
  },
  editPreferencesText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  logButton: {
    backgroundColor: "black",
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginVertical: 30,
  },
  logButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
