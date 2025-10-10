import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  firstName: string;
  lastName: string;
  onEdit?: () => void;
};

export default function ProfileHeader({ firstName, lastName, onEdit }: Props) {
  return (
    <View style={styles.profileHeader}>
      <Image
        source={{ uri: "https://i.pravatar.cc/300" }}
        style={styles.avatar}
      />
      <Text style={styles.name}>
        {firstName && lastName ? `${firstName} ${lastName}` : "Loading..."}
      </Text>
      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <Text style={styles.editText}>Edit profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
