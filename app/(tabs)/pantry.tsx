import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { usePantry, PantryItem } from '../../hooks/usePantry';
import { useAuth } from '../context/AuthContext';
import { pantryServices } from '../../services/pantryServices';
import HeaderFormatFor from '../../components/HeaderFormatFor';
import FloatingActionButton from '../../components/FloatingActionButton';
import LoadingViewFor from '../../components/LoadingViewFor';
import CategoryChips, { Category } from '../../components/pantry/CategoryChips';
import CategoryRowView from '../../components/pantry/CategoryRowView';
import ItemList from '../../components/pantry/ItemList';
import PantryStats from '../../components/pantry/PantryStats';
import PantryEmptyState from '../../components/pantry/PantryEmptyState';
import ItemAddModal from '../../components/pantry/ItemAddModal';
import CategoryAddModal from '../../components/pantry/CategoryAddModal';
import CategoryViewAllModal from '../../components/pantry/CategoryViewAllModal';

export default function PantryScreen() {
  const { user } = useAuth();
  const { items, loading, stats, addItem, updateItem, deleteItem } = usePantry();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [viewAllCategoriesVisible, setViewAllCategoriesVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null);

  const categories: Category[] = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    items.forEach(item => {
      const count = categoryMap.get(item.category) || 0;
      categoryMap.set(item.category, count + 1);
    });

    const categoriesArray: Category[] = [
      { id: 'all', name: 'All Items' }
    ];

    categoryMap.forEach((count, name) => {
      categoriesArray.push({
        id: name,
        name: name,
      });
    });

    return categoriesArray;
  }, [items]);

  const categoryNames = useMemo(() => {
    return items
      .map(item => item.category)
      .filter((cat, index, self) => self.indexOf(cat) === index)
      .sort();
  }, [items]);

  const categoriesWithData = useMemo(() => {
    const categoryMap = new Map<string, { count: number; isDefault: boolean }>();
    
    items.forEach(item => {
      const existing = categoryMap.get(item.category);
      categoryMap.set(item.category, {
        count: (existing?.count || 0) + 1,
        isDefault: existing?.isDefault || false,
      });
    });

    const allCategories: Category[] = [];
    categoryMap.forEach((data, name) => {
      allCategories.push({
        id: name,
        name: name,
      });
    });

    return allCategories.sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);
  
  const handleAddItem = async (data: {
    name: string;
    category: string;
    quantity?: string;
    expiryDate?: string;
  }) => {
    try {
      await addItem(data);
      setItemModalVisible(false);
    } 
    catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  };

  const handleEditItem = (item: PantryItem) => {
    setEditingItem(item);
    setEditModalVisible(true);
  };

  const handleUpdateItem = async (
    itemId: string,
    updates: {
      name: string;
      category: string;
      quantity?: string;
      expiryDate?: string;
    }
  ) => {
    try {
      await updateItem(itemId, updates);
      setEditModalVisible(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    try {
      await deleteItem(id);
      console.log('Deleted item:', name);
    } 
    catch (error) {
      console.error('Error deleting item:', error);
      Alert.alert('Error', 'Failed to delete item');
    }
  };

  
  const handleAddCategory = async (categoryName: string) => {
    if (!user?.uid) {
      Alert.alert('Error', 'You must be logged in to add categories');
      return;
    }

    try {
      await pantryServices.addCategory(user.uid, categoryName);
      setCategoryModalVisible(false);
    } 
    catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };

  const handleDeleteCategory = async (
    categoryId: string,
    categoryName: string,
  ) => {
    if (!user?.uid) return;

    try {
      await pantryServices.deleteCategory(user.uid, categoryId, categoryName);
      
      if (selectedCategory === categoryName) {
        setSelectedCategory('all');
      }
    } 
    catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  const handleRenameCategory = async (categoryId: string, newName: string) => {
    if (!user?.uid) return;

    try {
      await pantryServices.renameCategory(user.uid, categoryId, newName);
    } 
    catch (error) {
      console.error('Error renaming category:', error);
      throw error;
    }
  };

  if (loading) { return <LoadingViewFor page="pantry" />; }

  return (
    <View style={styles.container}>
      <HeaderFormatFor page="Pantry" />

      <PantryStats
        totalItems={stats.totalItems}
        lowStockCount={stats.lowStockCount}
      />

      <CategoryRowView
        onViewAll={() => setViewAllCategoriesVisible(true)}
        onAddCategory={() => setCategoryModalVisible(true)}
        chips={
          <CategoryChips
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onAddCategory={() => setCategoryModalVisible(true)}
          />
        }
      />

      <Text style={styles.itemText}>Items</Text>

      {items.length === 0 ? 
        (<PantryEmptyState onAddItem={() => setItemModalVisible(true)} />) 
        : 
        (<ItemList
            items={items}
            selectedCategory={selectedCategory}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onAddItem={() => setItemModalVisible(true)}
          />
        )
      }

      <FloatingActionButton onPress={() => setItemModalVisible(true)} />

      <ItemAddModal
        visible={itemModalVisible}
        onClose={() => setItemModalVisible(false)}
        onAdd={handleAddItem}
        categories={categoryNames}
      />

      <CategoryAddModal
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        onAdd={handleAddCategory}
        existingCategories={categoryNames}
      />

      <CategoryViewAllModal
        visible={viewAllCategoriesVisible}
        onClose={() => setViewAllCategoriesVisible(false)}
        categories={categoriesWithData}
        onDeleteCategory={handleDeleteCategory}
        onRenameCategory={handleRenameCategory}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke',
    padding: 8,
  },
  content: {
    flex: 1,
  },
  itemText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'black',
    paddingHorizontal: 12,
    marginTop: 8,
    marginBottom: 8,
  },
});