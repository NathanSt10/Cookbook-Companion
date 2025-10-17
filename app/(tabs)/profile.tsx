import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import PreferencesList from "../../components/profile/PreferencesList";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileTabs, { TabType } from "../../components/profile/ProfileTabs";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const {
    loading: profileLoading,
    firstName,
    lastName,
    preferences,
    error,
    refresh,
  } = useUserProfile();
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("collections");
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await signOut();
      router.replace("/");
    } catch (e: any) {
      Alert.alert("Logout failed", e?.message ?? "Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
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
        return <PreferencesList preferences={preferences} />;

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={ styles.title }>My Profile</Text>
      <ScrollView>
        <ProfileHeader
          firstName={firstName}
          lastName={lastName}
          onEdit={() => router.push({ pathname: "/editprofile" } as any)}
        />

        <ProfileTabs active={activeTab} onChange={(t) => setActiveTab(t)} />

        {profileLoading && ( 
          <Text style={styles.emptyText}>Loading profile...</Text>
        )}
        {error && (
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={{ color: "red" }}>
              Error loading profile: {String(error.message)}
            </Text>
            <Pressable onPress={() => refresh()}>
              <Text style={{ color: "blue", marginTop: 8 }}>Retry</Text>
            </Pressable>
          </View>
        )}

        {!profileLoading && !error && renderTabContent()}

        <Pressable
          onPress={handleLogout}
          disabled={loggingOut}
          style={styles.logButton}
        >
          <Text style={styles.logButtonText}>
            {loggingOut ? "Logging out..." : "Logout"}
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
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
  collectionImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 10,
    backgroundColor: "#eee",
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
