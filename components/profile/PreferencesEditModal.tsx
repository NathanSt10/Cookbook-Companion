import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, View } from 'react-native';
import { useAuth } from '../../app/context/AuthContext';
import { PreferencesItemArray } from '../../hooks/usePreferences';
import { preferenceServices } from '../../services/preferencesServices';
import ModalHeaderFor from '../../utils/ModalHeaderFor';
import PreferencesSection from "./PreferencesSection";

interface EditPreferencesModalProps {
    visible: boolean;
    onClose: () => void;
    currentPreferences: PreferencesItemArray;
    onRefresh?: () => Promise<void>;
}

export default function PreferencesEditModal({ visible, onClose, currentPreferences, onRefresh } : EditPreferencesModalProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [preferences, setPreferences] = useState<PreferencesItemArray>(currentPreferences);

    useEffect(() => {
        if (visible) { 
            console.log(`modal opened, setting preferences: ${currentPreferences}`);
            setPreferences(currentPreferences); 
        }
    }, [visible, currentPreferences]);

    const handleAdd = (prefType: keyof PreferencesItemArray, item: string) => {
        console.log(`adding ${item} to ${prefType}`);
        setPreferences(prev => ({
            ...prev, 
            [prefType]: [...prev[prefType], item]
        }));
    };

    const handleRemove = (prefType: keyof PreferencesItemArray, item: string) => {
        console.log(`removing ${item} from ${prefType}`);
        setPreferences(prev => ({
            ...prev,
            [prefType]: prev[prefType].filter((x: string) => x !== item),
        }));
    };

    const handleSave = async () => {
        if (!user) { return; }

        try {
            setLoading(true);
            console.log(`saving preferences: ${preferences}`);
            
            await preferenceServices.updatePreferences(user.uid, preferences);
            console.log('freferences saved to firestore');
            
            if (onRefresh) {
                console.log('refreshing preferences');
                await onRefresh();
                console.log('preferences refresheD');
            }
            
            onClose();
        }
        catch (e: any) {
            console.error(`error saving preference: ${e}`);
            Alert.alert('Error', 'Failed to save preferences, try again');
        }
        finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        console.log('canceling, resetting to:', currentPreferences);
        setPreferences(currentPreferences);
        onClose();
    };

    return (
        <Modal visible={visible} animationType='slide'>
            <View style={styles.container}>
                <ModalHeaderFor
                    title="Edit Preferences"
                    onBack={handleCancel}
                    onSave={handleSave}
                    loading={loading}
                />
                
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
                        placeholder="e.g., Mushrooms, Olives, Cilantro"
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