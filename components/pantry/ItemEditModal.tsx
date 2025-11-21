import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PantryItem } from '../../hooks/usePantry';
import ModalHeaderFor from '../../utils/ModalHeaderFor';

interface ItemEditModalProps {
  visible: boolean;
  onClose: () => void;
  onEdit: (itemId: string, data: { name: string; category: string[]; quantity?: string; expireDate?: string }) => Promise<void>;
  categories: string[];
  editingItem: PantryItem | null;
}

export default function ItemEditModal({
  visible,
  onClose,
  onEdit,
  categories,
  editingItem,
}: ItemEditModalProps) {
  const [name, setName] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<string>('');
  const [expireDate, setExpireDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [newCategoryInput, setNewCategoryInput] = useState<string>('');

  const allCategories = [...new Set([...categories, ...selectedCategories])];

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setSelectedCategories(Array.isArray(editingItem.category) ? editingItem.category : [editingItem.category]);
      setQuantity(editingItem.quantity || '');
      setExpireDate(editingItem.expireDate || '');
    }
  }, [editingItem]);

  const resetForm = () => {
    setName('');
    setSelectedCategories([]);
    setQuantity('');
    setExpireDate('');
    setNewCategoryInput('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }

    if (selectedCategories.length === 0) {
      Alert.alert('Error', 'Please select at least one category');
      return;
    }

    if (!editingItem) {
      Alert.alert('Error', 'No item selected for editing');
      return;
    }

    setLoading(true);
    try {
      await onEdit(editingItem.fireId, {
        name: name.trim(),
        category: selectedCategories,
        quantity: quantity.trim() || undefined,
        expireDate: expireDate.trim() || undefined,
      });
      
      console.log("edited item in pantry");
      resetForm();
      onClose();
    } 
    catch (error) {
      Alert.alert('Error', 'Failed to edit item. Please try again.');
    } 
    finally {
      setLoading(false);
    }
  };

  const handleAddNewCategory = () => {
    const trimmedCategory = newCategoryInput.trim().toLowerCase();

    if (!trimmedCategory) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    const categoryExists = allCategories.some(
      cat => cat.toLowerCase() === trimmedCategory
    );

    if (categoryExists) {
      Alert.alert('Error', 'This category already exists');
      return;
    }

    setSelectedCategories(prev => [...prev, trimmedCategory]);
    setNewCategoryInput('');
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat)
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <ModalHeaderFor
        title='Edit Item'
        onBack={handleClose}
        onSave={handleSave}
        rightText='Save'
        loading={loading}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Item Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Tomatoes, Milk, Rice"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category *</Text>
          
          <View style={styles.newCategoryContainer}>
            <TextInput
              style={styles.newCategoryInput}
              placeholder="Create new category..."
              value={newCategoryInput}
              onChangeText={setNewCategoryInput}
              autoCapitalize="words"
              editable={!loading}
              onSubmitEditing={handleAddNewCategory}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddNewCategory}
              disabled={!newCategoryInput.trim() || loading}
            >
              <Ionicons 
                name="add-circle" 
                size={24} 
                color='black'
              />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {allCategories.length > 0 && (
            <View style={styles.categoryChips}>
              {allCategories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    selectedCategories.includes(cat) && styles.categoryChipSelected,
                  ]}
                  onPress={() => toggleCategory(cat)}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategories.includes(cat) && styles.categoryChipTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {selectedCategories.length > 0 && (
            <View style={styles.selectedContainer}>
              <Text style={styles.selectedCount}>
                {selectedCategories.length} selected: {selectedCategories.join(', ')}
              </Text>
            </View>
          )}

          <Text style={styles.hint}>
            Tap categories to select multiple, or create a new one above
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Quantity (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 2, 500g, 1L"
            value={quantity}
            onChangeText={setQuantity}
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Expire Date (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 2024-12-31"
            value={expireDate}
            onChangeText={setExpireDate}
            editable={!loading}
          />
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: 'whitesmoke',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
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
    marginTop: 8,
    fontStyle: 'italic',
  },
  newCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  newCategoryInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'gainsboro',  
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: 'black',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  categoryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  categoryChip: {
    backgroundColor: 'ghostwhite',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'gainsboro',
  },
  categoryChipSelected: {
    backgroundColor: 'gainsboro',
    borderColor: 'black',
    borderWidth: 1.5,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  categoryChipTextSelected: {
    color: 'black',
    fontWeight: 'bold',
  },
  selectedCount: {
    fontSize: 13,
    color: 'royalblue',
    fontWeight: 'bold',
  },
  selectedContainer: {
    backgroundColor: 'aliceblue',
    padding: 10,
    borderRadius: 8,
  },
});