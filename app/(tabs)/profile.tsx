import { router } from 'expo-router';
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useUserProfile } from "../../hooks/useUserProfile";
import EmptyStateFor from '../../components/profile/EmptyStateFor';
import ProfileViewToggle, { ProfileViewType } from "../../components/profile/ProfileViewToggle"
import ProfileHeaderCard from '../../components/profile/ProfileHeaderCard';
import LikedView from '../../components/profile/LikedView';
import SavedView from '../../components/profile/SavedView';
import HeaderFormatFor from '../../components/HeaderFormatFor';
import LoadingViewFor from '../../components/LoadingViewFor'; 
import PreferencesView from '@/components/profile/PreferencesView';

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ProfileViewType>("liked");
  const [editProfileModalVisible, setEditProfileModalVisible] = useState<boolean>(true);
  const { firstName, lastName, email, preferences, likedRecipes, savedRecipes } = useUserProfile();

  if (loading) { return (<LoadingViewFor page={"profile"} />); }

  const renderTabContent = () => {
    switch (activeTab) {
      case "liked": 
        return (
          <View style={styles.tabContent}>
            {likedRecipes.length === 0 ? 
              (<EmptyStateFor 
                  tab="liked"
                  onAddItem={() => router.push('/(tabs)/cookbook')}
                />
              )
              :
              (<LikedView/>)
            }
          </View>
        );

      case "saved":
        return (
          <View style={styles.tabContent}>
            {savedRecipes.length === 0 ? 
              (<EmptyStateFor
                  tab="saved"
                  onAddItem={() => router.push('/(tabs)/cookbook')}
                />
              )
              :
              (<SavedView/>)
            }
          </View>
        );

      case "preferences":
        return (
          <View style={styles.tabContent}>
            <PreferencesView preferences={preferences} />
          </View>
        );
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
      <HeaderFormatFor page="Profile"/>

      <ProfileHeaderCard
        firstName={firstName}
        lastName={lastName}
        email={email}
        onEditProfile={editProfileModalVisible}
      />

      <ProfileViewToggle
        active={activeTab}
        onChange={setActiveTab}
      />

      {renderTabContent()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "whitesmoke",
    padding: 8,
  },
  tabContent: {
    padding: 20,
    position: "relative",
  }
});