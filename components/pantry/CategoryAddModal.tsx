import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import ModalHeaderFor from '../../utils/ModalHeaderFor';

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

    if (existingCategories.some(cat => cat.toLowerCase() === trimmedName.toLowerCase())) {
      Alert.alert('Error', 'This category already exists');
      return;
    }

    setLoading(true);
    try {
      await onAdd(trimmedName);
      resetForm();
    }
    catch (e: any) {
      console.error(`error adding category: ${e}`);
      Alert.alert('Error', 'Failed to add category, try again');
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
      <ModalHeaderFor
        title='Add Category'
        onBack={handleClose}
        onSave={handleAdd}
        rightText='Add'
        loading={loading}
      />

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

        {existingCategories.length > 0 && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Existing Categories</Text>
            <Text style={styles.infoText}>{existingCategories.join(', ')}</Text>
          </View>
          )
        }
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});