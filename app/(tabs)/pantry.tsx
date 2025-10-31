import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  View
} from 'react-native';
import { usePantry } from '../../hooks/usePantry';
import PantryStats from '../../components/pantry/PantryStats';
import CategoryFilter, { Category } from '../../components/pantry/CategoryFilter';
import ItemList from '../../components/pantry/ItemList';
import ItemAddModal from '../../components/pantry/ItemAddModal';
import CategoryAddModal from '../../components/pantry/CategoryAddModal';
import PantryEmptyState from '../../components/pantry/PantryEmptyState';

export default function PantryScreen() {
  const { items, loading, stats, addItem, deleteItem } = usePantry();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

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
      .filter((cat, index, self) => self.indexOf(cat) === index);
  }, [items]);

  const handleDeleteItem = (id: string, name: string) => {
    deleteItem(id);
    console.log("Deleted item:", name);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="black" />
        <Text style={styles.loadingText}>Loading pantry...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Pantry</Text>
      </View>

      <PantryStats
        totalItems={stats.totalItems}
        lowStockCount={stats.lowStockCount}
      />

      {items.length === 0 ? (
        <PantryEmptyState onAddItem={() => setItemModalVisible(true)} />
      ) : (
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {categories.length > 1 && (
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onAddCategory={() => setCategoryModalVisible(true)}
            />
          )}

          <ItemList
            items={items}
            selectedCategory={selectedCategory}
            onDeleteItem={handleDeleteItem}
            onAddItem={() => setItemModalVisible(true)}
          />
        </ScrollView>
      )}

      {items.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setItemModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}

      <ItemAddModal
        visible={itemModalVisible}
        onClose={() => setItemModalVisible(false)}
        onAdd={addItem}
        categories={categoryNames}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'ghostwhite',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'ghostwhite',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: 'tan',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
  },
  content: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: 'ghostwhite',
    fontWeight: '300',
  },
});