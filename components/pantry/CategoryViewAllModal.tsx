import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { capitalizeEachFirstLetter } from '../../utils/CapitalizeFirstLetter';
import ModalHeaderFor from '../../utils/ModalHeaderFor';
import CategoryEditModal from './CategoryEditModal';

interface Category {
  addedAt: Date;
  fireId: string;
  name: string;
  itemCount?: number;
  agingDays?: number;
  urgentDays?: number;
}

interface CategoryViewAllModalProps {
  visible: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategories?: string[];
  onSelectCategories?: (categoryNames: string[]) => void;
  onDeleteCategory: (categoryId: string, categoryName: string) => Promise<void>;
  onRenameCategory: (categoryId: string, newCategoryName: string, agingDays: number, urgentDays: number) => Promise<void>;
}

export default function CategoryViewAllModal({
  visible,
  onClose,
  categories,
  selectedCategories = [],
  onSelectCategories,
  onDeleteCategory,
  onRenameCategory,
}: CategoryViewAllModalProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localSelectedCategories, setLocalSelectedCategories] =
    useState<string[]>(selectedCategories);

  React.useEffect(() => {
    if (visible) {
      setLocalSelectedCategories(selectedCategories);
    }
  }, [visible]);

  const handleStartEdit = (category: Category) => {
    setEditingCategory(category);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async (
    categoryId: string,
    newName: string,
    agingDays: number,
    urgentDays: number
  ) => {
    setLoading(true);
    try {
      await onRenameCategory(categoryId, newName, agingDays, urgentDays);
      setEditModalVisible(false);
      setEditingCategory(null);
    } 
    catch (error: any) {
      console.error(`error saving edit: ${error}`);
      Alert.alert('Error', 'Failed to update category');
    } 
    finally {
      setLoading(false);
    }
  };

  const handleDelete = async (category: Category) => {
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${category.name}"? Items in this category will be moved to "other".`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await onDeleteCategory(category.fireId, category.name);

              const updatedSelection = localSelectedCategories.filter(
                (cat) => cat !== category.name
              );
              
              setLocalSelectedCategories(updatedSelection);
              
              if (onSelectCategories) {
                onSelectCategories(updatedSelection);
              }
            } 
            catch (e: any) {
              console.error(`failed to delete category: ${e}`);
              Alert.alert('Error', 'Failed to delete category');
            } 
            finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const toggleCategorySelection = (categoryName: string) => {
    const newSelection = localSelectedCategories.includes(categoryName)
      ? localSelectedCategories.filter((cat) => cat !== categoryName)
      : [...localSelectedCategories, categoryName];

    setLocalSelectedCategories(newSelection);
  };

  const handleApplyFilters = () => {
    if (onSelectCategories) {
      onSelectCategories(localSelectedCategories);
    }
    onClose();
  };

  const handleClearAll = () => {
    setLocalSelectedCategories([]);
  };

  const handleSelectAll = () => {
    const allCategoryNames = categories
      .filter((cat) => cat.fireId !== 'all')
      .map((cat) => cat.name);
    setLocalSelectedCategories(allCategoryNames);
  };

  const renderCategory = ({ item }: { item: Category }) => {
    const isSelected = localSelectedCategories.includes(item.name);

    return (
      <View
        style={[styles.categoryItem, isSelected && styles.categoryItemSelected]}
      >
        {onSelectCategories && (
          <TouchableOpacity
            onPress={() => toggleCategorySelection(item.name)}
            style={styles.checkboxContainer}
            disabled={loading}
            testID="category-checkbox"
          >
            <View
              style={[styles.checkbox, isSelected && styles.checkboxSelected]}
            >
              {isSelected && (
                <Ionicons name="checkmark" size={18} color="white" />
              )}
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.categoryInfo}
          onPress={() =>
            onSelectCategories && toggleCategorySelection(item.name)
          }
          activeOpacity={0.7}
          disabled={loading}
        >
          <Text style={styles.categoryName}>
            {capitalizeEachFirstLetter(item.name)}
          </Text>
          {item.itemCount !== undefined && (
            <View style={styles.categoryMeta}>
              <Text style={styles.itemCount}>
                {item.itemCount} {item.itemCount === 1 ? 'item' : 'items'}
              </Text>
            </View>)
          }
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => handleStartEdit(item)}
            style={styles.actionButton}
            disabled={loading}
            testID={`edit-category-button-${item.fireId}`}
          >
            <Ionicons name="pencil" size={20} color="royalblue" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDelete(item)}
            style={styles.actionButton}
            disabled={loading}
            testID={`delete-category-${item.fireId}`}
          >
            <Ionicons name="close-circle" size={20} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const filteredCategories = categories.filter((cat) => cat.fireId !== 'all');
  const existingCategoryNames = categories.map((cat) => cat.name);

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent={false}
        onRequestClose={onClose}
      >
        <ModalHeaderFor
          title="All Categories"
          onBack={onClose}
          onSave={onSelectCategories && handleApplyFilters}
          rightText="Apply"
          loading={loading}
          backButtonTestId="back-button"
          rightButtonTestId="apply-filters-button"
        />

        {onSelectCategories && (
          <View style={styles.filterControls}>
            <View style={styles.selectionInfo}>
              <Ionicons name="filter" size={20} color="royalblue" />
              <Text style={styles.selectionText}>
                {localSelectedCategories.length === 0
                  ? 'No filters applied'
                  : `${localSelectedCategories.length} ${
                      localSelectedCategories.length === 1
                        ? 'category'
                        : 'categories'
                    } selected`}
              </Text>
            </View>

            <View style={styles.filterButtons}>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={handleSelectAll}
                disabled={loading}
              >
                <Text style={styles.filterButtonText}>Select All</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterButton, styles.clearButton]}
                onPress={handleClearAll}
                disabled={loading || localSelectedCategories.length === 0}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    localSelectedCategories.length === 0 &&
                      styles.disabledText,
                  ]}
                  accessibilityState={{
                    disabled:
                      loading || localSelectedCategories.length === 0,
                  }}
                >
                  Clear All
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item.fireId}
          renderItem={renderCategory}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No categories yet</Text>
            </View>
          }
        />
      </Modal>

      <CategoryEditModal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
        existingCategories={existingCategoryNames}
        onSave={handleSaveEdit}
      />
    </>
  );
}

const styles = StyleSheet.create({
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
  categoryItemSelected: {
    borderWidth: 2,
    borderColor: 'royalblue',
    backgroundColor: 'aliceblue',
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'gainsboro',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  checkboxSelected: {
    backgroundColor: 'royalblue',
    borderColor: 'royalblue',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 4,
  },
  categoryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: 'grey',
  },
  filterControls: {
    backgroundColor: 'whitesmoke',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'gainsboro',
  },
  selectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  selectionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    flex: 1,
    backgroundColor: 'royalblue',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: 'black',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  disabledText: {
    color: 'white',
  },
});