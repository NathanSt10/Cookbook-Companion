import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CategoryAddModal from '../../components/pantry/CategoryAddModal';
import CategoryRowView from '../../components/pantry/CategoryRowView';
import CategoryViewAllModal from '../../components/pantry/CategoryViewAllModal';
import ItemAddModal from '../../components/pantry/ItemAddModal';
import ItemEditModal from '../../components/pantry/ItemEditModal';
import ItemList from '../../components/pantry/ItemList';
import PantryEmptyState from '../../components/pantry/PantryEmptyState';
import PantryStats from '../../components/pantry/PantryStats';
import { useCategory } from '../../hooks/useCategory';
import { PantryItem, PantryItemInput, usePantry } from '../../hooks/usePantry';
import { categoryServices } from '../../services/categoryServices';
import { pantryServices } from '../../services/pantryServices';
import FloatingActionButton from '../../utils/FloatingActionButton';
import HeaderFormatFor from '../../utils/HeaderFormatFor';
import LoadingViewFor from '../../utils/LoadingViewFor';
import { getItemStatus } from '../../utils/PantryAgeUtils';
import { useAuth } from '../context/AuthContext';

export default function PantryScreen() {
  const { user } = useAuth();
  const { pantry: items, stats, loading: loadingPantry } = usePantry();
  const { categories, loading: loadingCategory } = useCategory();
  const [addPantryItemModalVisible, setAddPantryItemModalVisible] = useState(false);
  const [editPantryItemModalVisible, setEditPantryItemModalVisible] = useState(false);
  const [addCategoryModalVisible, setAddCategoryModalVisible] = useState(false);
  const [viewAllCatModalVisible, setViewAllCatModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); 
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'lowStock' | 'aging' | 'urgent'>('all');
  
  const handleViewAllCategoriesEdit = async (
    categoryId: string,
    newName: string,
    agingDays: number,
    urgentDays: number
  ) => {
    if (!user?.uid) { return; }
    
    await categoryServices.editCategory(user.uid, categoryId, newName, agingDays, urgentDays);
  };

  const handleViewAllCategoriesDelete = async (categoryId: string, categoryName: string ) => {
    if (!user?.uid) { return; }
    
    await categoryServices.deleteCategory(user.uid, categoryId, categoryName);
  };

  const handleAddCategoryAdd = async (categoryName: string, agingDays?: number, urgentDays?: number) => {
    if (!user?.uid) { return; }

    await categoryServices.addCategory(user.uid, categoryName, agingDays, urgentDays);
    setAddCategoryModalVisible(false);
  };

  const handlePantryItemAdd = async (itemData: PantryItemInput) => {
    if (!user?.uid) { return; }

    console.log(`adding pantry item: ${itemData}`);
    await pantryServices.addItem(user.uid, itemData);
    console.log('syncing categories');
    await categoryServices.syncCategoriesFromPantry(user.uid);

    console.log(`item added`)
    setAddPantryItemModalVisible(false);
  };
  
  const handlePantryItemEdit = async (itemId: string, updates: Partial<PantryItemInput>) => {
    if (!user?.uid) { return; }

    console.log(`updating pantry item ${itemId} with ${updates}`);
    await pantryServices.editItem(user.uid, itemId, updates);
    console.log('syncing categories after edit');
    await categoryServices.syncCategoriesFromPantry(user.uid);

    console.log('item was updated');
    setEditingItem(null);
    setEditPantryItemModalVisible(false);
  };

  const handlePantryItemEditHelper = (item: PantryItem) => {
    setEditingItem(item); 
    setEditPantryItemModalVisible(true);
  }

  const handlePantryItemDelete = async (itemId: string) => {
    if (!user?.uid) { return; }

    await pantryServices.deleteItem(user.uid, itemId);
  };

  const handleSelectCategories = (categoryNames: string[]) => {
    setSelectedCategories(categoryNames);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedStatus('all');
  };

  const handleStatusFilter = (status: 'all' | 'lowStock' | 'aging' | 'urgent') => {
    setSelectedStatus(status);
  };

  const updateItemCardCategories = useMemo(() => {
    const names = new Set<string>();
    items.forEach(item => {
      if (item.category && Array.isArray(item.category)) {
        item.category.forEach(cat => names.add(cat));
      }
    });
    
    return Array.from(names).sort();
  }, [items]);

  const updateModalCategories = useMemo(() => {
    return categories.map(cat => cat.name).sort();
  }, [categories])

  const categoriesWithData = useMemo(() => {
    return categories.map(cat => ({
      ...cat,
      fireId: cat.fireId,
      itemCount: items.filter(item => 
        item.category && item.category.includes(cat.name)
      ).length,
    }));
  },[categories, items]);

const filteredItems = useMemo(() => {
  let filtered = items;

  if (selectedCategories.length > 0) {
    filtered = filtered.filter(item => 
      item.category && 
      Array.isArray(item.category) && 
      selectedCategories.every(selectedCat => 
        item.category.includes(selectedCat)
      )
    );
  }

  if (selectedStatus !== 'all') {
    filtered = filtered.filter(item => {
      if (selectedStatus === 'lowStock') {
        if (!item.quantity) { return false; }
        const quantity = typeof item.quantity === 'string'
          ? parseFloat(item.quantity)
          : item.quantity;
        return !isNaN(quantity) && quantity > 0 && quantity <= 2;
      }

      if (selectedStatus === 'aging') {
        const status = getItemStatus(item.addedAt);
        return status === 'warning';
      }

      if (selectedStatus === 'urgent') {
        const status = getItemStatus(item.addedAt);
        return status === 'critical';
      }

      return true;
    });
  }

  return filtered;
}, [items, selectedCategories, selectedStatus]);

  if (loadingCategory || loadingPantry) { return <LoadingViewFor page="pantry" />; }
  return (
    <View style={styles.container}>
      <HeaderFormatFor page="Pantry" />
                      
      <PantryStats
        totalItems={stats.totalItems}
        lowStockCount={stats.lowStockCount}
        categoryCount={stats.categoryCount}
        agingCount={stats.agingCount}
        urgentCount={stats.urgentCount}
        onFilterByStatus={handleStatusFilter}
        selectedStatus={selectedStatus}
      />

      <CategoryRowView
        onViewAll={() => setViewAllCatModalVisible(true)}
        onAddCategory={() => setAddCategoryModalVisible(true)}
      />
        
      {selectedCategories.length > 0 && (
        <View style={styles.filterBanner}>
          <View style={styles.filterInfo}>
            <Text style={styles.filterText}>
              Filtering by {selectedCategories.length} {selectedCategories.length === 1 ? 'category' : 'categories'}
            </Text>
            <Text style={styles.filterSubtext}>
              {selectedCategories.join(', ')}
            </Text>
          </View>
          <TouchableOpacity onPress={handleClearFilters} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View> )
      }

      <Text style={styles.itemText}>
        Items {selectedCategories.length > 0 && `(${filteredItems.length})`}
      </Text>

      {items.length === 0 
        ? ( <View style={styles.emptyStateWrapper}>
              <PantryEmptyState onAddItem={() => setAddPantryItemModalVisible(true)} />
            </View>
          )
        : filteredItems.length === 0 
            ? (<View style={styles.emptyFilterContainer}>
                 <Text style={styles.emptyFilterTitle}>No items match your filters</Text>
                 <Text style={styles.emptyFilterSubtitle}>
                   Try selecting different categories or clear your filters
                 </Text>
                 <TouchableOpacity onPress={handleClearFilters} style={styles.emptyFilterButton}>
                   <Text style={styles.emptyFilterButtonText}>Clear Filters</Text>
                 </TouchableOpacity>
               </View>
              )
            : (<ItemList
                 items={filteredItems}
                 categories={categories}
                 onEditItem={handlePantryItemEditHelper}
                 onDeleteItem={handlePantryItemDelete}
                 onAddItem={() => setAddPantryItemModalVisible(true)}
               />
              )
      }

      <FloatingActionButton onPress={() => setAddPantryItemModalVisible(true)} />

      <ItemAddModal
        visible={addPantryItemModalVisible}
        onClose={() => setAddPantryItemModalVisible(false)}
        onAdd={handlePantryItemAdd}
        categories={updateModalCategories}
      />

      <ItemEditModal
        visible={editPantryItemModalVisible}
        onClose={() => {
          setEditPantryItemModalVisible(false);
          setEditingItem(null);
        }}
        onEdit={handlePantryItemEdit}
        categories={updateModalCategories}
        editingItem={editingItem}
      />

      <CategoryAddModal
        visible={addCategoryModalVisible}
        onClose={() => setAddCategoryModalVisible(false)}
        onAdd={handleAddCategoryAdd}
        existingCategories={updateModalCategories}
      />

      <CategoryViewAllModal
        visible={viewAllCatModalVisible}
        onClose={() => setViewAllCatModalVisible(false)}
        categories={categoriesWithData}
        selectedCategories={selectedCategories}
        onSelectCategories={handleSelectCategories}
        onDeleteCategory={handleViewAllCategoriesDelete}
        onRenameCategory={handleViewAllCategoriesEdit}
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
  emptyStateWrapper: {
    flex: 1,
    marginTop: 40,
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  filterBanner: {
    backgroundColor: 'aliceblue',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: 'royalblue',
  },
  filterInfo: {
    flex: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 4,
  },
  filterSubtext: {
    fontSize: 12,
    color: 'royalblue',
  },
  clearButton: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'royalblue',
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'royalblue',
  },
  emptyFilterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyFilterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'grey',
    marginBottom: 8,
  },
  emptyFilterSubtitle: {
    fontSize: 14,
    color: 'tan',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyFilterButton: {
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyFilterButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});