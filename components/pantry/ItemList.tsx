import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { PantryItem } from '../../hooks/usePantry';
import ItemCard from './ItemCard';
import PantryEmptyState from './PantryEmptyState';

interface ItemListProps {
  items: PantryItem[];
  selectedCategory?: string;
  onEditItem?: (item: PantryItem) => void;
  onDeleteItem?: (id: string, name: string) => void;
  onItemPress?: (item: PantryItem) => void;
  onAddItem?: () => void;
}

export default function ItemList({
  items,
  selectedCategory,
  onEditItem,
  onDeleteItem,
  onItemPress,
  onAddItem,
}: ItemListProps) {
  const filteredItems = selectedCategory && selectedCategory !== 'all'
    ? items.filter(item => item.category === selectedCategory)
    : items;

  if (items.length === 0) {
    return <PantryEmptyState onAddItem={onAddItem || (() => {})} />;
  }

  if (filteredItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No items in this category</Text>
        
        <Text style={styles.emptySubtitle}>
          Try selecting a different category or add items to this one
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={filteredItems}
      keyExtractor={(item) => item.fireId}
      renderItem={({ item }) => (
        <ItemCard
          item={item}
          onPress={onItemPress ? () => onItemPress(item) : undefined}
          onEdit={onEditItem ? () => onEditItem(item) : undefined}
          onDelete={onDeleteItem ? () => onDeleteItem(item.fireId, item.name) : undefined}
        />
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
    paddingTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'grey',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: 'tan',
    textAlign: 'center',
  },
});