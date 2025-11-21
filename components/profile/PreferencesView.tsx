import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { PreferencesItemArray } from "../../hooks/usePreferences";
import PreferenceCard from "./PreferenceCard";
import PreferencesEditModal from "./PreferencesEditModal";

type PreferencesViewProps = {
  preferences: PreferencesItemArray;
  onRefresh?: () => Promise<void>;
};

export default function PreferencesView({ preferences, onRefresh }: PreferencesViewProps) {
  const [editModalVisible, setEditModalVisible] = useState(false);

  return (
    <>
      <ScrollView style={styles.container}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setEditModalVisible(true)}
        >
          <Text style={styles.editButtonText}>Edit Preferences</Text>
        </TouchableOpacity>
        
        <PreferenceCard
          title="Dietary Preferences"
          items={preferences?.dietary}
        />

        <PreferenceCard
          title="Allergies"
          items={preferences?.allergies}
        />

        <PreferenceCard
          title="Dislikes"
          items={preferences?.dislikes}
        />

        <PreferenceCard
          title="Favorite Cuisines"
          items={preferences?.cuisines}
        />

        <PreferenceCard
          title="Kitchenware"
          items={preferences?.kitchenware}
        />

        <PreferenceCard
          title="Cooking Preferences"
          items={preferences?.cookingpref}
        />
      </ScrollView>

      <PreferencesEditModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        currentPreferences={preferences}
        onRefresh={onRefresh}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  editButton: {
    backgroundColor: "black",
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  editButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});