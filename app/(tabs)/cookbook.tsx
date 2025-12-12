import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import BrowseModal from "../../components/cookbook/BrowseModal";
import RecipeSection from "../../components/cookbook/RecipeSection";
import SearchBar from "../../components/cookbook/SearchBar";
import { useCookbook } from "../../hooks/useCookbook";
import { likedRecipeServices } from "../../services/likedRecipesServices";
import { savedRecipeServices } from "../../services/savedRecipesServices";
import HeaderFormatFor from "../../utils/HeaderFormatFor";
import { searchRecipes } from "../api/spoonacular";
import { useAuth } from '../context/AuthContext';

export default function CookbookPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [browseModalVisible, setBrowseModalVisible] = useState(false);
  const [browseResults, setBrowseResults] = useState<any[]>([]);
  const isFirstRender = useRef(true);
  const { user } = useAuth();
  const { recipes, loading, error } = useCookbook();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchTerm(searchQuery);
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    (async () => {
      if (searchTerm.trim()) {
        const data = await searchRecipes(searchTerm);
        setSearchResults(data.results || []);
      }
    })();
  }, [searchTerm]);

  const handleLikedRecipe = async (recipeId: number, title: string, image: string) => {
    console.log('handling liked recipe: ', recipeId, title);
    if (!user?.uid) { return; }
    
    try {
      await likedRecipeServices.toggleLikedRecipe(user.uid, {
        recipeId: recipeId.toString(),
        title,
        image,
      });
      console.log(`recipe liked from cookbook card: ${title}`);  
    } 
    catch (error) {
      console.error('Error toggling liked recipe:', error);
    }
  };

  const handleSavedRecipe = async (recipeId: number, title: string, image: string) => {
    console.log('handling saved recipe: ', recipeId, title);
    if (!user?.uid) { return; }
    
    try {
      await savedRecipeServices.toggleSavedRecipe(user.uid, {
        recipeId: recipeId.toString(),
        title,
        image,
      });
      console.log(`recipe saved from cookbook card: ${title}`);
    } catch (error) {
      console.error('Error toggling saved recipe:', error);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderFormatFor page="Cookbook" />

      <View style={styles.searchRow}>
        <View style={styles.searchBarContainer}>
          <SearchBar  
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmit={handleSearch}
            placeholder="Search recipes..."
          />
        </View>
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => setBrowseModalVisible(true)}
        >
          <Ionicons name="archive-outline" size={24} color="royalblue" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {browseResults.length > 0 && (
          <RecipeSection
            title="Browse Results"
            recipes={browseResults.map((r) => ({
              id: r.recipeId,
              title: r.title,
              image: r.image,
              cookTime: r.cookTime ?? 0,
              usedIngredientCount: r.usedIngredientCount,
              missedIngredientCount: r.missedIngredientCount,
            }))}
            showViewAll={browseResults.length > 5}
            onLike={handleLikedRecipe}
            onSave={handleSavedRecipe}
            testID="browse-results-section"
            hideWhenEmpty={true}
          />
        )}

        {searchResults.length > 0 && (
          <RecipeSection
            title="Search Results"
            recipes={searchResults.map((r) => ({
              id: r.id,
              title: r.title,
              image: r.image,
              cookTime: r.readyInMinutes ?? 0,
            }))}
            onLike={handleLikedRecipe}
            onSave={handleSavedRecipe}
            testID="search-results-section"
            hideWhenEmpty={true}
          />
        )}

        <RecipeSection  
          title="Your Cookbook"
          subtitle="Recipes in your cookbook"
          recipes={recipes.cookbook}
          testID="cookbook-section"
          emptyMessage="Save recipes to your cookbook to access them anytime"
        />

        <RecipeSection
          title="For You"
          subtitle="Based on your preferences"
          recipes={recipes.forYou}
          onLike={handleLikedRecipe}
          onSave={handleSavedRecipe}
          testID="for-you-section"
          emptyMessage="Populate your pantry and customize your preferences to get personalized recipe suggestions"
        />

        <RecipeSection
          title="Finish It"
          subtitle="Grab a few more ingredients to make these"
          recipes={recipes.finishIt}
          onLike={handleLikedRecipe}
          onSave={handleSavedRecipe}
          testID="finish-it-section"
          emptyMessage="Add ingredients to your pantry to see recipes you're close to completing"
        />

        <RecipeSection
          title="Similar Recipes"
          subtitle="More like what you viewed"
          recipes={recipes.similar}
          onLike={handleLikedRecipe}
          onSave={handleSavedRecipe}
          testID="similar-section"
          emptyMessage="View a recipe to get similar suggestions based on what you like"
        />
      </ScrollView>

      <BrowseModal
        visible={browseModalVisible}
        onClose={() => setBrowseModalVisible(false)}
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
  },
  searchBarContainer: {
    flex: 1,
  },
  browseButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});