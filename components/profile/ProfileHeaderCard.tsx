import React, { useState } from "react";
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProfileEditModal from "../../components/profile/ProfileEditModal";

type ProfileHeaderProps = {
  firstName: string;
  lastName: string;
  email?: string;
  onEditProfile?: boolean;
};

export default function ProfileHeaderCard({ firstName, lastName, email, onEditProfile, }: ProfileHeaderProps) {
  const [editProfileModalVisible, setEditProfileModalVisible] = useState<boolean>(false);

  return (
    <>
      <View style={styles.profileCard}>
        <View style={styles.leftSection}>
          <Image
            source={{ uri: "https://i.pravatar.cc/300" }}
            style={styles.avatar}
          />
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.name}>
            {firstName && lastName ? `${firstName} ${lastName}` : "Loading..."}
          </Text>
        
          <Text style={styles.email}>
            {email ? `${email}` : "Loading..."}
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => setEditProfileModalVisible(true)}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>

      <Modal
        visible={editProfileModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setEditProfileModalVisible(false)}
      >
        <ProfileEditModal onClose={() => setEditProfileModalVisible(false)} />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: "row",
    backgroundColor: "ghostwhite",
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 0,
    marginTop: 0,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 10,
  },
  leftSection: {
    marginRight: 16,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 30,
  },
  rightSection: {
    flex: 1,
    justifyContent: "flex-start",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
    marginBottom: 1,
  },
  email: {
    fontSize: 14,
    color: "grey",
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 20,
  },
  button: {
    flex: 1,
    backgroundColor: "black",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  iconButton: {
    color: 'black',
  },
});