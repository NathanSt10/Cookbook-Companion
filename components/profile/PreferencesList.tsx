import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Preferences } from "../../hooks/useUserProfile";

type Props = {
  preferences: Preferences | null;
};

export default function PreferencesList({ preferences }: Props) {
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
}

const styles = StyleSheet.create({
  tabContent: { padding: 20 },
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
  preferenceText: { fontSize: 16 },
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
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    marginTop: 40,
  },
});
