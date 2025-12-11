import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import BrowseModal from "../../components/cookbook/BrowseModal";
import RecipeSection from "../../components/cookbook/RecipeSection";
import SearchBar from "../../components/cookbook/SearchBar";
import { useCookbook } from "../../hooks/useCookbook";
import { useLikedRecipes } from '../../hooks/useLikedRecipes';
import { useSavedRecipes } from '../../hooks/useSavedRecipes';
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
  const [likedRecipes, setLikedRecipes] = useState<Set<number>>(new Set());
  const [savedRecipes, setSavedRecipes] = useState<Set<number>>(new Set());
  const { likedRecipes: likedRecipesList } = useLikedRecipes();
  const { savedRecipes: savedRecipesList } = useSavedRecipes();
  const [browseResults, setBrowseResults] = useState<any[]>([]);
  const isFirstRender = useRef(true);
  const { user } = useAuth();
  const { recipes, loading, error } = useCookbook();

  const [optimisticLiked, setOptimisticLiked] = useState<Set<number>>(new Set());
  const [optimisticSaved, setOptimisticSaved] = useState<Set<number>>(new Set());

  // Merge hook data with optimistic updates
  const likedRecipeIds = useMemo(() => {
    const ids = new Set(likedRecipesList.map(r => parseInt(r.recipeId)));
    // Merge with optimistic updates
    optimisticLiked.forEach(id => ids.add(id));
    return ids;
  }, [likedRecipesList, optimisticLiked]);

  const savedRecipeIds = useMemo(() => {
    const ids = new Set(savedRecipesList.map(r => parseInt(r.recipeId)));
    // Merge with optimistic updates
    optimisticSaved.forEach(id => ids.add(id));
    return ids;
  }, [savedRecipesList, optimisticSaved]);

  const isRecipeLiked = (recipeId: number) => likedRecipeIds.has(recipeId);
  const isRecipeSaved = (recipeId: number) => savedRecipeIds.has(recipeId);

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
    console.log('handleLikedRecipe called:', recipeId, title);
    if (!user?.uid) { return; }
    
    // Optimistically update
    setOptimisticLiked(prev => {
      const newSet = new Set(prev);
      if (likedRecipeIds.has(recipeId)) {
        newSet.delete(recipeId);
      } else {
        newSet.add(recipeId);
      }
      return newSet;
    });
    
    try {
      const result = await likedRecipeServices.toggleLikedRecipe(user.uid, {
        recipeId: recipeId.toString(),
        title,
        image,
      });
      console.log('toggleLikedRecipe result:', result);
      
      // Clear optimistic update once Firestore updates (the hook will have the real data)
      setTimeout(() => {
        setOptimisticLiked(new Set());
      }, 1000);
    } 
    catch (error) {
      // Revert optimistic update on error
      setOptimisticLiked(prev => {
        const newSet = new Set(prev);
        if (newSet.has(recipeId)) {
          newSet.delete(recipeId);
        } else {
          newSet.add(recipeId);
        }
        return newSet;
      });
      console.error('Error toggling liked recipe:', error);
    }
  };

  const handleSavedRecipe = async (recipeId: number, title: string, image: string) => {
    console.log('handleSavedRecipe called:', recipeId, title);
    if (!user?.uid) { return; }
    
    // Optimistically update
    setOptimisticSaved(prev => {
      const newSet = new Set(prev);
      if (savedRecipeIds.has(recipeId)) {
        newSet.delete(recipeId);
      } else {
        newSet.add(recipeId);
      }
      return newSet;
    });
    
    try {
      const result = await savedRecipeServices.toggleSavedRecipe(user.uid, {
        recipeId: recipeId.toString(),
        title,
        image,
      });
      console.log('toggleSavedRecipe result:', result);
      
      // Clear optimistic update once Firestore updates
      setTimeout(() => {
        setOptimisticSaved(new Set());
      }, 1000);
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticSaved(prev => {
        const newSet = new Set(prev);
        if (newSet.has(recipeId)) {
          newSet.delete(recipeId);
        } else {
          newSet.add(recipeId);
        }
        return newSet;
      });
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
          style={styles.filterButton}
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
              isLiked: isRecipeLiked(r.recipeId),
              isSaved: isRecipeSaved(r.recipeId),
            }))}
            showViewAll={browseResults.length > 5}
            onLike={handleLikedRecipe}
            onSave={handleSavedRecipe}
            testID="browse-results-section"
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
              isLiked: isRecipeLiked(r.recipeId),
              isSaved: isRecipeSaved(r.recipeId),
            }))}
            onLike={handleLikedRecipe}
            onSave={handleSavedRecipe}
            testID="search-results-section"
          />
        )}

        <RecipeSection
          title="For You"
          subtitle="Based on your preferences"
          recipes={recipes.forYou}
          onLike={handleLikedRecipe}
          onSave={handleSavedRecipe}
          testID="for-you-section"
        />

        <RecipeSection
          title="Finish It"
          subtitle="Gab a few more ingredients to make these"
          recipes={recipes.finishIt}
          onLike={handleLikedRecipe}
          onSave={handleSavedRecipe}
          testID="finish-it-section"
        />

        <RecipeSection
          title="Similar Recipes"
          subtitle="More like what you viewed"
          recipes={recipes.similar}
          onLike={(recipeId, title, image) => handleLikedRecipe(recipeId, title, image)}
          onSave={(recipeId, title, image) => handleSavedRecipe(recipeId, title, image)}
          testID="similar-section"
        />

        <RecipeSection
          title="Recently Viewed"
          subtitle="Pick up where you left off"
          recipes={recipes.recentlyViewed}
          onLike={(recipeId, title, image) => handleLikedRecipe(recipeId, title, image)}
          onSave={(recipeId, title, image) => handleSavedRecipe(recipeId, title, image)}
          testID="recently-viewed-section"
        />

        <RecipeSection
          title="Random Picks"
          subtitle="A little surprise"
          recipes={recipes.random}
          onLike={(recipeId, title, image) => handleLikedRecipe(recipeId, title, image)}
          onSave={(recipeId, title, image) => handleSavedRecipe(recipeId, title, image)}
          testID="random-section"
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
  filterButton: {
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