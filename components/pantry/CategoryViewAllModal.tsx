import React, { useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export interface Category {
  id: string;
  name: string;
  isDefault?: boolean;
  itemCount?: number;
}

interface CategoryViewAllModalProps {
  visible: boolean;
  onClose: () => void;
  categories: Category[];
  onDeleteCategory: (categoryId: string, categoryName: string) => Promise<void>;
  onRenameCategory: (categoryId: string, newName: string) => Promise<void>;
}

export default function CategoryViewAllModal({
  visible,
  onClose,
  categories,
  onDeleteCategory,
  onRenameCategory,
}: CategoryViewAllModalProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStartEdit = (category: Category) => {
    setEditingId(category.id);
    setEditValue(category.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleSaveEdit = async (categoryId: string) => {
    const trimmedName = editValue.trim();
    
    if (!trimmedName) {
      Alert.alert('Error', 'Category name cannot be empty');
      return;
    }

    const isDuplicate = categories.some(
      cat => cat.id !== categoryId && cat.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      Alert.alert('Error', 'A category with this name already exists');
      return;
    }

    setLoading(true);
    try {
      await onRenameCategory(categoryId, trimmedName);
      setEditingId(null);
      setEditValue('');
    } catch (error) {
      Alert.alert('Error', 'Failed to rename category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (category: Category) => {
    try {
      await onDeleteCategory(category.id, category.name);
    } 
    catch (e: any) {
      Alert.alert("Error", "Failed to delete category");
    }
    finally {
      setLoading(false);
    }
  };

  const renderCategory = ({ item }: { item: Category }) => {
    const isEditing = editingId === item.id;

    return (
      <View style={styles.categoryItem}>
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.editInput}
              value={editValue}
              onChangeText={setEditValue}
              autoFocus
              maxLength={30}
            />
            <View style={styles.editActions}>
              <TouchableOpacity
                onPress={() => handleSaveEdit(item.id)}
                style={styles.editButton}
                disabled={loading}
              >
                <Ionicons name="checkmark-circle" size={28} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCancelEdit}
                style={styles.editButton}
                disabled={loading}
              >
                <Ionicons name="close-circle" size={28} color="firebrick" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.categoryInfo}>
              <View>
                <Text style={styles.categoryName}>{item.name}</Text>
                <View style={styles.categoryMeta}>
                  {item.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Default</Text>
                    </View>
                  )}
                  {item.itemCount !== undefined && (
                    <Text style={styles.itemCount}>
                      {item.itemCount} item{item.itemCount !== 1 ? 's' : ''}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => handleStartEdit(item)}
                style={styles.actionButton}
                disabled={loading}
              >
                <Ionicons name="pencil" size={20} color="black" />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => handleDelete(item)}
                style={styles.actionButton}
                disabled={loading || item.isDefault}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={item.isDefault ? 'lightgray' : 'firebrick'}
                />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={{ width: 60 }} />
          <Text style={styles.title}>All Categories</Text>
          <TouchableOpacity onPress={onClose} disabled={loading}>
            <Text style={styles.doneButton}>Done</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={categories.filter(cat => cat.id !== 'all')}
          keyExtractor={(item) => item.id}
          renderItem={renderCategory}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No categories yet</Text>
            </View>
          }
        />
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
  doneButton: {
    fontSize: 16,
    color: 'royalblue',
    fontWeight: '600',
    width: 60,
    textAlign: 'right',
  },
  listContent: {
    padding: 16,
  },
  categoryItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    marginBottom: 4,
  },
  categoryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  defaultBadge: {
    backgroundColor: 'royalblue',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  defaultBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  itemCount: {
    fontSize: 14,
    color: 'grey',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  editContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editInput: {
    flex: 1,
    backgroundColor: 'ghostwhite',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'royalblue',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 4,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: 'grey',
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'gainsboro',
  },
  footerText: {
    fontSize: 14,
    color: 'grey',
    textAlign: 'center',
  },
});