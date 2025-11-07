import React, { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type CategoryRowViewProps = {
  onViewAll?: () => void;  
  onAddCategory?: () => void; 
  chips: ReactNode;
};

export default function CategoryRowView({
  onViewAll,
  onAddCategory,
  chips
  }: CategoryRowViewProps) {
  
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Categories</Text>
        <View style={styles.actions}>
          {onViewAll && (
            <TouchableOpacity onPress={onViewAll} style={styles.actionBtn}>
              <Text style={styles.actionText}>View All</Text>
            </TouchableOpacity>)
          }
          {onAddCategory && (
            <TouchableOpacity onPress={onAddCategory} style={styles.actionBtnPrimary} testID="add-category">
              <Text style={styles.actionTextPrimary}>Add Category</Text>
            </TouchableOpacity>)
          }
        </View>
      </View>

      <View style={styles.content}>
        {chips}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'whitesmoke',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: 'black',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'gainsboro',
  },
  actionText: { 
    fontSize: 13, 
    color: 'black' 
  },
  actionBtnPrimary: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'black',
  },
  actionTextPrimary: { 
    fontSize: 13, 
    color: 'white', 
    fontWeight: '600' 
  },
  content: {
    // style for the chip tsx file
  },
});
