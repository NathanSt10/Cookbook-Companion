import { router } from 'expo-router';
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import EmptyStateFor from '../../components/profile/EmptyStateFor';
import LikedView from '../../components/profile/LikedView';
import PreferencesView from '../../components/profile/PreferencesView';
import ProfileHeaderCard from '../../components/profile/ProfileHeaderCard';
import ProfileViewToggle, { ProfileViewType } from "../../components/profile/ProfileViewToggle";
import SavedView from '../../components/profile/SavedView';
import { useLikedRecipes } from '../../hooks/useLikedRecipes';
import { usePreferences } from '../../hooks/usePreferences';
import { useProfile } from "../../hooks/useProfile";
import { useSavedRecipes } from '../../hooks/useSavedRecipes';
import HeaderFormatFor from '../../utils/HeaderFormatFor';
import LoadingViewFor from '../../utils/LoadingViewFor';
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ProfileViewType>("liked");
  const [editProfileModalVisible, setEditProfileModalVisible] = useState<boolean>(true);
  const { firstName, lastName, email } = useProfile();
  const { item: preferences, refresh } = usePreferences();

  if (loading) { return (<LoadingViewFor page={"profile"} />); }

  const renderTabContent = () => {
    switch (activeTab) {
      case "liked": 
        return (
          <View style={styles.tabContent}>
            {useLikedRecipes.length === 0 
              ? (<EmptyStateFor 
                    tab="liked"
                    onAddItem={() => router.push('/(tabs)/cookbook')}
                 />
                )
              :  <LikedView
                    />
            }
          </View>
        );

      case "saved":
        return (
          <View style={styles.tabContent}>
            {useSavedRecipes.length === 0 
              ? (<EmptyStateFor
                    tab="saved"
                    onAddItem={() => router.push('/(tabs)/cookbook')}
                 />
                )
              :  <SavedView/>
            }
          </View>
        );

      case "preferences":
        return (
          <View style={styles.tabContent}>
            <PreferencesView 
              preferences={preferences}
              onRefresh={refresh} />
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