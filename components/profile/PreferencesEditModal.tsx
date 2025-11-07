import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Modal, ScrollView, TouchableOpacity, Alert,  } from 'react-native';
import { useAuth } from "../../app/context/AuthContext";
import { useUserProfile, Preferences } from "../../hooks/useUserProfile";
import { userProfileServices } from "../../services/userProfileServices";
import HeaderFormatFor from "../HeaderFormatFor";
import PreferencesSection from "./PreferencesSection";

interface EditPreferencesModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function PreferencesEditModal({ visible, onClose } : EditPreferencesModalProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const { preferences: currentPreferences, refresh } = useUserProfile();
    const [preferences, setPreferences] = useState<Preferences>({
        dietary: [],
        allergies: [],
        cuisines: [],
        kitchenware: [],
        dislikes: [],
        cookingpref: [],
    });

    useEffect(() => {
        if (currentPreferences) {
            setPreferences({
                dietary: currentPreferences.dietary || [],
                allergies: currentPreferences.allergies || [],
                cuisines: currentPreferences.cuisines || [],
                kitchenware: currentPreferences.kitchenware || [],
                dislikes: currentPreferences.dislikes || [],
                cookingpref: currentPreferences.cookingpref || [],
            });
        }
    }, [currentPreferences]);

    const handleAdd = async (prefType: keyof Preferences, item: string) => {
        setPreferences(prev => ({
            ...prev,
            [prefType]: [...(prev[prefType] || []), item]
        }));
    };

    const handleRemove = (prefType: keyof Preferences, item: string) => {
        setPreferences(prev => ({
            ...prev,
            [prefType]: (prev[prefType] || []).filter((x: string) => x !== item),
        }));
    };

    const handleSave = async () => {
        if (!user) {
            Alert.alert("Error", "No user logged in");
            return;
        }

        try {
            setLoading(true);
            await userProfileServices.updatePreferences(user.uid, preferences);
            await refresh();
            console.log("saved preferences");
            onClose();
        }
        catch (e: any) {
            console.warn("error: ", e.message);
        }
        finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (currentPreferences) {
            setPreferences({
                dietary: currentPreferences.dietary || [],
                allergies: currentPreferences.allergies || [],
                cuisines: currentPreferences.cuisines || [],
                kitchenware: currentPreferences.kitchenware || [],
                dislikes: currentPreferences.dislikes || [],
                cookingpref: currentPreferences.cookingpref || [],
            });
        }
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType='slide'
            transparent={false}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <HeaderFormatFor page="Edit Preferences" />

                <ScrollView style={styles.scrollView}>
                    <PreferencesSection 
                        title="Dietary Preferences"
                        items={preferences.dietary || []}
                        onAdd={(item) => handleAdd("dietary", item)}
                        onRemove={(item) => handleRemove("dietary", item)}
                        placeholder="e.g., Vegetarian, Keto, Carnivore"
                        disabled={loading}
                    />

                    <PreferencesSection 
                        title="Allergies"
                        items={preferences.allergies || []}
                        onAdd={(item) => handleAdd("allergies", item)}
                        onRemove={(item) => handleRemove("allergies", item)}
                        placeholder="e.g., Peanuts, Dairy, Shellfish"
                        disabled={loading}
                    />

                    <PreferencesSection 
                        title="Favorite Cuisines"
                        items={preferences.cuisines || []}
                        onAdd={(item) => handleAdd("cuisines", item)}
                        onRemove={(item) => handleRemove("cuisines", item)}
                        placeholder="e.g., Italian, Mexican, Japanese"
                        disabled={loading}
                    />

                    <PreferencesSection 
                        title="Kitchenware"
                        items={preferences.kitchenware || []}
                        onAdd={(item) => handleAdd("kitchenware", item)}
                        onRemove={(item) => handleRemove("kitchenware", item)}
                        placeholder="e.g., Air Fryer, Instant Pot, Blender"
                        disabled={loading}
                    />

                    <PreferencesSection 
                        title="Dislikes"
                        items={preferences.dislikes || []}
                        onAdd={(item) => handleAdd("dislikes", item)}
                        onRemove={(item) => handleRemove("dislikes", item)}
                        placeholder="e.g., Mushrooms, Olives, CIlantro"
                        disabled={loading}
                    />

                    <PreferencesSection 
                        title="Cooking Preferences"
                        items={preferences.cookingpref || []}
                        onAdd={(item) => handleAdd("cookingpref", item)}
                        onRemove={(item) => handleRemove("cookingpref", item)}
                        placeholder="e.g., One-Pot, Beginner, 30 Mins"
                        disabled={loading}
                    />
                </ScrollView>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.saveButton, loading && { opacity: 0.6 }]}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        <Text style={styles.saveButtonText}>
                            {loading ? "Saving... " : "Save Preferences"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={handleCancel}
                        disabled={loading}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "whitesmoke",
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    buttonContainer: {
        padding: 16, 
        backgroundColor: "whitesmoke",
        borderTopWidth: 1,
        borderTopColor: "ghostwhite",
    },
    saveButton: {
        backgroundColor: "black",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    saveButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    cancelButton: {
        padding: 14,
        marginTop: 1,
        borderWidth: 1,
        elevation: 10,
    },
    cancelButtonText: {
        color: "black",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    }
});