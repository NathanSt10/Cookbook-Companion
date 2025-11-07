import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';

export interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onAddCategory?: () => void;
  onViewAllCategories?: () => void;
}

export default function CategoryChips({
  categories,
  selectedCategory,
  onSelectCategory,
  onAddCategory,
  onViewAllCategories,
}: CategoryFilterProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipSelected,
            ]}
            onPress={() => onSelectCategory(category.id)}
            activeOpacity={0.7}
            testID={`category-${category.id}`}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextSelected,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  scrollContent: {
    paddingRight: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'gainsboro',
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryChipSelected: {
    backgroundColor: 'gainsboro',
    borderColor: 'black',
    borderWidth: 1.75,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'black',
  },
  categoryTextSelected: {
    color: 'black',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'ghostwhite',
    fontSize: 14,
    fontWeight: '600',
  },
  categorySubtitle: {
    color: 'black',
    fontSize: 20,
    marginBottom: 12,
    fontWeight: 500,
    alignSelf: 'center',
  }
});