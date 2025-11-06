import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type ProfileViewType =
  | "liked"
  | "saved"
  | "preferences";

type ProfileViewToggleProps = {
  active: ProfileViewType;
  onChange: (tab: ProfileViewType) => void;
};

export default function ProfileViewToggle({ 
  active, 
  onChange 
  }: ProfileViewToggleProps) {

  return (
    <View style={styles.toggle}>
      <TouchableOpacity 
        style={[styles.item, active === "liked" && styles.active]}
        onPress={() => onChange("liked")}
      >
        <Text style={[styles.text, active === "liked" && styles.textActive]}>
          Liked
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.item, active === "saved" && styles.active]}
        onPress={() => onChange("saved")}
      >
        <Text style={[styles.text, active === "saved" && styles.textActive]}>
          Saved
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.item, active === "preferences" && styles.active]}
        onPress={() => onChange("preferences")}
      >
        <Text style={[styles.text, active === "preferences" && styles.textActive]}>
          Preferences
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  toggle: {
    flexDirection: "row",
    backgroundColor: 'gainsboro',
    shadowColor: "black",
    borderRadius: 12,
    padding: 4,
  },
  item: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center', 
  },
  active: {
    backgroundColor: "ghostwhite",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
    justifyContent: 'center',
  },
  textActive: {
    fontWeight: "700",
  }
});