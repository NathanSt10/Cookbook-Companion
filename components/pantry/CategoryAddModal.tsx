import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CategoryAddModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (categoryName: string) => Promise<void>;
  existingCategories: string[];
}

export default function CategoryAddModal({
  visible,
  onClose,
  onAdd,
  existingCategories,
}: CategoryAddModalProps) {
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setCategoryName('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAdd = async () => {
    const trimmedName = categoryName.trim();
    
    if (!trimmedName) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    const isDuplicate = existingCategories.some(
      cat => cat.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      Alert.alert('Error', 'This category already exists');
      return;
    }

    setLoading(true);
    try {
      await onAdd(trimmedName);
      console.log('Category added:', trimmedName);
      resetForm();
      onClose();
    } 
    catch (error) {
      console.error('Error adding category:', error);
      Alert.alert('Error', 'Failed to add category. Please try again.');
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} disabled={loading}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Add Category</Text>
          <TouchableOpacity onPress={handleAdd} disabled={loading}>
            <Text style={[styles.addButton, loading && styles.disabledButton]}>
              {loading ? 'Adding...' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Frozen Foods, Leftovers, Herbs"
              value={categoryName}
              onChangeText={setCategoryName}
              autoCapitalize="words"
              autoFocus
              editable={!loading}
              maxLength={30}
            />
            <Text style={styles.hint}>
              Create custom categories to organize your pantry
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'ghostwhite',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'gainsboro',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  cancelButton: {
    fontSize: 16,
    color: 'grey',
  },
  addButton: {
    fontSize: 16,
    color: 'royalblue',
    fontWeight: '600',
  },
  disabledButton: {
    color: '#999',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'gainsboro',
  },
  hint: {
    fontSize: 12,
    color: 'grey',
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: 'royalblue',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});