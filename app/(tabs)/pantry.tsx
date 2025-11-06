import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { usePantry } from '../../hooks/usePantry';
import HeaderFormatFor from '../../components/HeaderFormatFor';
import FloatingActionButton from '../../components/FloatingActionButton';
import LoadingViewFor from '../../components/LoadingViewFor';
import CategoryChips, { Category } from '../../components/pantry/CategoryChips';
import CategoryRowView from '../../components/pantry/CategoryRowView';
import ItemList from '../../components/pantry/ItemList';
import PantryStats from '../../components/pantry/PantryStats';
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
  console.log("grabbed these cats: ", items);

  const handleDeleteItem = (id: string, name: string) => {
    deleteItem(id);
    console.log("Deleted item:", name);
  };

  // make a setLoading function to toggle it on
  if (loading) { return (<LoadingViewFor page="pantry"/>); }

  return (
    <View style={styles.container}>
      <HeaderFormatFor page="Pantry"/>

      <PantryStats
        totalItems={stats.totalItems}
        lowStockCount={stats.lowStockCount}
      />

      <CategoryRowView 
        onViewAll={() => setSelectedCategory('all')}
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
        (<PantryEmptyState onAddItem={() => setItemModalVisible(false)}/>) 
        :
        (<ItemList 
            items={items}
            selectedCategory={selectedCategory}
            onDeleteItem={handleDeleteItem}
          /> 
        ) 
      }

      <FloatingActionButton onPress={() => setItemModalVisible(true)} />      
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
  },
});