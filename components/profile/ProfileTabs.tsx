import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type TabType =
  | "collections"
  | "recipes"
  | "liked"
  | "saved"
  | "preferences";

type Props = {
  active: TabType;
  onChange: (tab: TabType) => void;
};

export default function ProfileTabs({ active, onChange }: Props) {
  return (
    <View style={styles.tabs}>
      <TouchableOpacity onPress={() => onChange("collections")}>
        <Text
          style={[styles.tab, active === "collections" && styles.activeTab]}
        >
          Collections
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChange("recipes")}>
        <Text style={[styles.tab, active === "recipes" && styles.activeTab]}>
          Recipes
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChange("liked")}>
        <Text style={[styles.tab, active === "liked" && styles.activeTab]}>
          Liked
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChange("saved")}>
        <Text style={[styles.tab, active === "saved" && styles.activeTab]}>
          Saved
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChange("preferences")}>
        <Text
          style={[styles.tab, active === "preferences" && styles.activeTab]}
        >
          Preferences
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
