import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ItemAddModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (data: { name: string; category: string; quantity?: string; expiryDate?: string }) => Promise<void>;
  categories: string[];
}

export default function ItemAddModal({
  visible,
  onClose,
  onAdd,
  categories,
}: ItemAddModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName('');
    setCategory('');
    setQuantity('');
    setExpiryDate('');
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

    if (!category.trim()) {
      Alert.alert('Error', 'Please select or enter a category');
      return;
    }

    setLoading(true);
    try {
      await onAdd({
        name: name.trim(),
        category: category.trim(),
        quantity: quantity.trim() || undefined,
        expiryDate: expiryDate.trim() || undefined,
      });
        
      console.log("added item to pantry")
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
          <Text style={styles.title}>Add Pantry Item</Text>
          <TouchableOpacity onPress={handleAdd} disabled={loading}>
            <Text style={[styles.addButton, loading && styles.disabledButton]}>
              {loading ? 'Adding...' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>

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
            {categories.length > 0 && (
              <View style={styles.categoryChips}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      category === cat && styles.categoryChipSelected,
                    ]}
                    onPress={() => setCategory(cat)}
                    disabled={loading}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        category === cat && styles.categoryChipTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <TextInput
              style={styles.input}
              placeholder="Or enter a custom category"
              value={category}
              onChangeText={setCategory}
              autoCapitalize="words"
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quantity (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              value={quantity}
              onChangeText={setQuantity}
              editable={!loading}
            />
            <Text style={styles.hint}>
              .
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Expiry Date (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              value={expiryDate}
              onChangeText={setExpiryDate}
              editable={!loading}
            />
            <Text style={styles.hint}>
              .
            </Text>
          </View>
        </ScrollView>
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
    borderBottomColor: 'ghostwhite',
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
    borderColor: 'ghostwhite',
  },
  categoryChipSelected: {
    backgroundColor: 'gainsboro',
    borderColor: 'black',
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  categoryChipTextSelected: {
    color: 'black',
  },
});