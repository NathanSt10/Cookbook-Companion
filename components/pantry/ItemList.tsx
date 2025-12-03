import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { PantryItem } from '../../hooks/usePantry';
import ItemCard from './ItemCard';
import PantryEmptyState from './PantryEmptyState';

interface ItemListProps {
  items: PantryItem[];
  onEditItem?: (item: PantryItem) => void;
  onDeleteItem?: (id: string, name: string) => void;
  onItemPress?: (item: PantryItem) => void;
  onAddItem?: () => void;
}

export default function ItemList({
  items,
  onEditItem,
  onDeleteItem,
  onItemPress,
  onAddItem,
}: ItemListProps) {

  if (items.length === 0) {
    return <PantryEmptyState onAddItem={onAddItem || (() => {})} />;
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.fireId}
      renderItem={({ item }) => (
        <ItemCard
          item={item}
          onPress={onItemPress ? () => onItemPress(item) : undefined}
          onEdit={onEditItem ? () => onEditItem(item) : undefined}
          onDelete={onDeleteItem ? () => onDeleteItem(item.fireId, item.name) : undefined}
        />)
      }
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
});