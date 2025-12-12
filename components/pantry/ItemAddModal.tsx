import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PantryItemInput } from '../../hooks/usePantry';
import ModalHeaderFor from '../../utils/ModalHeaderFor';
import UnitSelector from '../../utils/UnitSelectorModal';

interface ItemAddModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (data: PantryItemInput) => Promise<void>;
  categories: string[];
}

export default function ItemAddModal({
  visible,
  onClose,
  onAdd,
  categories,
}: ItemAddModalProps) {
  const [name, setName] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [newCategoryInput, setNewCategoryInput] = useState<string>('');
  const [unit, setUnit] = useState<string>('');
  const [reminderDate, setReminderDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const allCategories = [...new Set([...categories, ...selectedCategories])];

  useEffect(() => {
    if (!visible) {
      resetForm();
    }
  }, [visible]);

  const resetForm = () => {
    setName('');
    setSelectedCategories([]);
    setQuantity('');
    setUnit('');
    setNewCategoryInput('');
    setReminderDate(undefined);
    setShowDatePicker(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAdd = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }

    if (selectedCategories.length === 0) {
      Alert.alert('Warning', 'No category selected, defaulting to Other');
    }

    if (quantity.trim() && !unit.trim()) {
      const validQuantityInput = /^[0-9]*\.?[0-9]+$/;

      if(!validQuantityInput.test(quantity)) {
        Alert.alert(
          'Invalid Quantity', 'Please enter a valid number'
        );

        return;
      }

      const numericQty = parseFloat(quantity);
      if (isNaN(numericQty) || numericQty <= 0) {
        Alert.alert('Invalid Quantity', 'Please enter a positive number');
        return;
      }

      if (numericQty > 1_000_000) {
        Alert.alert('Invalid Quantity', 'Quantity is too large');
        return;
      }
    }

    await submitItem();
  };

  const submitItem = async () => {
    setLoading(true);
    try {
      await onAdd({
        name: name.trim(),
        category: selectedCategories.length > 0 ? selectedCategories : ['other'],
        quantity: quantity.trim() || undefined,
        unit: unit.trim() || undefined,
        reminderDate: reminderDate,
      });
        
      console.log("added item to pantry");
      resetForm();
      onClose();
    } 
    catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'Failed to add item. Please try again.');
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
    
    console.log('Success', `Category "${trimmedCategory}" created and selected`);
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat)
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
    );
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // Android automatically closes the picker after selection
    setShowDatePicker(false);
    
    if (event.type === 'set' && selectedDate) {
      setReminderDate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const clearReminderDate = () => {
    setReminderDate(undefined);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <ModalHeaderFor
        title='Add Item'
        onBack={handleClose}
        onSave={handleAdd}
        rightText='Save'
        loading={loading}
        backButtonTestId='modal-back-button'
        rightButtonTestId='modal-save-button'
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
              style={[
                styles.addButton, 
                (!newCategoryInput.trim() || loading) && styles.addButtonDisabled,
              ]}
              onPress={handleAddNewCategory}
              disabled={loading}
            >
              <Ionicons name="add-circle" size={24} color='black'/>
              <Text 
                style={[
                  styles.addButtonText,
                  (!newCategoryInput.trim() || loading) && styles.addButtonTextDisabled,
                ]}

                accessibilityState={{ disabled: !newCategoryInput.trim() || loading }}
                >
                  Add
                </Text>
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
                    accessibilityState={{ disabled: loading }}
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
          <View style={styles.quantityRow}>
            <TextInput
              style={[styles.input, styles.quantityInput]}
              placeholder="e.g., 2, 500, 1.5"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType='decimal-pad'
              editable={!loading}
            />
            <UnitSelector
              selectedUnit={unit}
              onSelectUnit={setUnit}
              disabled={loading}
              testID="unit-selector"
            />
          </View>
            <Text style={styles.hint}>
              Enter amount and select a unit (e.g., "500" + "g" for 500 grams)
            </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Reminder Date (Optional)</Text>
          
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
            disabled={loading}
          >
            <Ionicons name="calendar-outline" size={20} color="royalblue" />
            <Text style={styles.datePickerButtonText}>
              {reminderDate ? formatDate(reminderDate) : 'Set a reminder date'}
            </Text>
            {reminderDate && (
              <TouchableOpacity
                onPress={clearReminderDate}
                style={styles.clearDateButton}
                disabled={loading}
              >
                <Ionicons name="close-circle" size={20} color="grey" />
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          <Text style={styles.hint}>
            Set a date to remind you about this item (e.g., expiration date)
          </Text>
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
  addButtonDisabled: {
    borderColor: 'gainsboro',
    backgroundColor: 'whitesmoke',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  addButtonTextDisabled: {
    color: 'gainsboro',
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
  quantityRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  quantityInput: {
    flex: 1,
  },
  datePickerButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'gainsboro',
  },
  datePickerButtonText: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  clearDateButton: {
    padding: 4,
  },
});