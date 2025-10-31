import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onAddCategory?: () => void;
  onViewAllCategories?: () => void;
}

export default function CategoryFilter({
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
        style={styles.scrollView}
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
            {category.icon && (
              <Text style={styles.categoryIcon}>{category.icon}</Text>
            )}
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

      <View style={styles.actionButtons}>
        {onAddCategory && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onAddCategory}
            testID="add-category-button"
          >
            <Text style={styles.actionButtonText}>+ Add Category</Text>
          </TouchableOpacity>
        )}

        {onViewAllCategories && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onViewAllCategories}
            testID="view-all-button"
          >
            <Text style={styles.actionButtonText}>View All</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  scrollView: {
    marginBottom: 12,
  },
  scrollContent: {
    paddingRight: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'gainsboro',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'white',
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
});