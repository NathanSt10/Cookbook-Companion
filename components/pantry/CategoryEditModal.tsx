import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { DEFAULT_AGING_DAYS, DEFAULT_URGENT_DAYS } from '../../utils/PantryAgeUtils';

interface Category {
  addedAt: Date;
  fireId: string;
  name: string;
  itemCount?: number;
  agingDays?: number;
  urgentDays?: number;
}

interface CategoryEditModalProps {
  visible: boolean;
  onClose: () => void;
  category: Category | null;
  existingCategories: string[];
  onSave: (categoryId: string, newName: string, agingDays: number, urgentDays: number) => Promise<void>;
}

export default function CategoryEditModal({
  visible,
  onClose,
  category,
  existingCategories,
  onSave,
}: CategoryEditModalProps) {
  const [categoryName, setCategoryName] = useState('');
  const [agingDays, setAgingDays] = useState<string>(DEFAULT_AGING_DAYS.toString());
  const [urgentDays, setUrgentDays] = useState<string>(DEFAULT_URGENT_DAYS.toString());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && category) {
      setCategoryName(category.name);
      setAgingDays(category.agingDays?.toString() || DEFAULT_AGING_DAYS.toString());
      setUrgentDays(category.urgentDays?.toString() || DEFAULT_URGENT_DAYS.toString());
    }
  }, [visible, category]);

  const resetForm = () => {
    setCategoryName('');
    setAgingDays(DEFAULT_AGING_DAYS.toString());
    setUrgentDays(DEFAULT_URGENT_DAYS.toString());
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateInputs = (): boolean => {
    const trimmedName = categoryName.trim();

    if (!trimmedName) {
      Alert.alert('Error', 'Category name cannot be empty');
      return false;
    }

    const isDuplicate = existingCategories.some(
      (existingName) =>
        existingName.toLowerCase() === trimmedName.toLowerCase() &&
        category &&
        existingName.toLowerCase() !== category.name.toLowerCase()
    );

    if (isDuplicate) {
      Alert.alert('Error', 'A category with this name already exists');
      return false;
    }

    const agingDaysNum = parseInt(agingDays);
    if (isNaN(agingDaysNum) || agingDaysNum < 1 || agingDaysNum > 365) {
      Alert.alert('Invalid Input', 'Aging days must be between 1 and 365');
      return false;
    }

    const urgentDaysNum = parseInt(urgentDays);
    if (isNaN(urgentDaysNum) || urgentDaysNum < 1 || urgentDaysNum > 365) {
      Alert.alert('Invalid Input', 'Urgent days must be between 1 and 365');
      return false;
    }

    if (urgentDaysNum <= agingDaysNum) {
      Alert.alert(
        'Invalid Input',
        'Urgent days must be greater than aging days'
      );
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!category) {
      Alert.alert('Error', 'No category selected for editing');
      return;
    }

    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    try {
      const agingDaysNum = parseInt(agingDays);
      const urgentDaysNum = parseInt(urgentDays);

      await onSave(
        category.fireId,
        categoryName.trim(),
        agingDaysNum,
        urgentDaysNum
      );

      resetForm();
      onClose();
    } 
    catch (error) {
      console.error('Error saving category:', error);
      Alert.alert('Error', 'Failed to save category. Please try again.');
    } 
    finally {
      setLoading(false);
    }
  };

  if (!category) { return null; }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Category</Text>

            <TouchableOpacity
              onPress={handleClose}
              disabled={loading}
            >
              <Ionicons name="close" size={28} color="black" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.formContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Frozen Foods, Leftovers, Herbs"
                value={categoryName}
                onChangeText={setCategoryName}
                autoCapitalize="words"
                editable={!loading}
                maxLength={30}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelWithInfo}>
                <Text style={styles.label}>Aging Days</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="e.g., 7, 14, 30"
                value={agingDays}
                onChangeText={setAgingDays}
                keyboardType="number-pad"
                editable={!loading}
                maxLength={3}
              />
              <Text style={styles.hint}>
                Number of days before items show "aging" warning (1-365)
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelWithInfo}>
                <Text style={styles.label}>Urgent Days</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="e.g., 14, 21, 60"
                value={urgentDays}
                onChangeText={setUrgentDays}
                keyboardType="number-pad"
                editable={!loading}
                maxLength={3}
              />
              <Text style={styles.hint}>
                Number of days before items show "urgent" warning (1-365, must be greater than aging days)
              </Text>
            </View>
          </ScrollView>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading 
                ? (<Text style={styles.saveButtonText}>Saving...</Text>) 
                : (<Text style={styles.saveButtonText}>Save Changes</Text>)
              }
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'gainsboro',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
  },
  formContent: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  labelWithInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  input: {
    backgroundColor: 'whitesmoke',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'gainsboro',
  },
  hint: {
    fontSize: 12,
    color: 'grey',
    marginTop: 6,
    fontStyle: 'italic',
  },
  itemCountBox: {
    backgroundColor: 'whitesmoke',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemCountText: {
    fontSize: 14,
    color: 'grey',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'gainsboro',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: 'black',
    flexDirection: 'row',
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: 'gainsboro',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});