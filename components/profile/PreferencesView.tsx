import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { Preferences } from "../../hooks/useUserProfile";
import PreferencesEditModal from "./PreferencesEditModal";
import PreferenceCard from "./PreferenceCard";

type PreferencesViewProps = {
  preferences: Preferences | null;
};

export default function PreferencesView({ preferences }: PreferencesViewProps) {
  const [editModalVisible, setEditModalVisible] = useState(false);

  return (
    <>
      <ScrollView style={styles.container}>
        
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
          items={preferences?.kitchware}
        />

        <PreferenceCard
          title="Cooking Preferences"
          items={preferences?.cookingpref}
        />

        {/* Edit Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setEditModalVisible(true)}
        >
          <Text style={styles.editButtonText}>Edit Preferences</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Preferences Modal */}
      <PreferencesEditModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
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