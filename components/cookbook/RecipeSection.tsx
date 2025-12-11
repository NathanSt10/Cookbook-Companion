import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RecipeCard from "./RecipeCard";

interface Recipe {
  id: number;
  title: string;
  image: string;
  cookTime?: number;
  usedIngredientCount?: number;
  missedIngredientCount?: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

interface RecipeSectionProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  recipes: Recipe[];
  emptyMessage?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
  
  onLike?: (recipeId: number, title: string, image: string) => void;
  onSave?: (recipeId: number, title: string, image: string) => void;
  testID?: string;
}

export default function RecipeSection({
  title,
  subtitle,
  icon,
  iconColor = "royalblue",
  recipes,
  emptyMessage = "No recipes available",
  showViewAll = false,
  onViewAll,
  onLike,
  onSave,
  testID,
}: RecipeSectionProps) {
  const handleRecipePress = (recipeId: number) => {
    router.push({
      pathname: '/recipe/[id]' as const,
      params: { id: recipeId }
    });
  };

  if (recipes.length === 0) { return null; }

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {icon && (
            <Ionicons name={icon} size={24} color={iconColor} style={styles.icon} /> )
          }
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
        
        {showViewAll && (
          <TouchableOpacity onPress={onViewAll} style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="chevron-forward" size={16} color="royalblue" />
          </TouchableOpacity> )
        }
      </View>

      <FlatList
        data={recipes}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <RecipeCard
            recipeId={item.id}
            title={item.title}
            image={item.image}
            cookTime={item.cookTime || 30}
            usedIngredientCount={item.usedIngredientCount}
            missedIngredientCount={item.missedIngredientCount}
            showIngredientMatch={title === "Finish It"}
            isLiked={item.isLiked}
            isSaved={item.isSaved}
            onLike={() => onLike?.(item.id, item.title, item.image)}
            onSave={() => onSave?.(item.id, item.title, item.image)}
            onPress={() => handleRecipePress(item.id)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
  },
  subtitle: {
    fontSize: 13,
    color: 'gray',
    marginTop: 2,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'royalblue',
    marginRight: 4,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
});