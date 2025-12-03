import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getRandomRecipes, SpoonacularRecipe } from '../../app/api/spoonacular';
import ModalHeaderFor from '../../utils/ModalHeaderFor';
import RecipeCard from './RecipeCard';

interface BrowseModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function BrowseModal({ visible, onClose }: BrowseModalProps) {
  const [recipes, setRecipes] = useState<SpoonacularRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomRecipes = async () => {
    setLoading(true);
    setError(null);

    try {
      const results = await getRandomRecipes(40);
      setRecipes(results);
    } 
    catch (e: any) {
      console.error('Error fetching browse recipes:', e);
      setError('Failed to load recipes. Please try again.');
      setRecipes([]);
    } 
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchRandomRecipes();
    }
  }, [visible]);

  const handleRecipePress = (id: number) => {
    onClose(); 
    router.push({
      pathname: '/recipe/[id]' as const,
      params: { id },
    });
  };

  const renderItem = ({ item }: { item: SpoonacularRecipe }) => (
    <View style={styles.cardWrapper}>
      <RecipeCard
        recipeId={item.recipeId}
        title={item.title}
        image={item.image || ''}
        cookTime={item.cookTime ?? 0}
        showIngredientMatch={false}
        onPress={() => handleRecipePress(item.recipeId)}
      />
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <ModalHeaderFor
          title="Browse Recipes"
          onBack={onClose}
          onSave={fetchRandomRecipes}
          rightText={loading ? 'Loading' : 'Shuffle'}
          loading={loading}
          showSave={true}
          backButtonTestId="browse-modal-back-button"
          rightButtonTestId="browse-modal-shuffle-button"
        />

        <View style={styles.content}>
          {loading && recipes.length === 0 
            ? (<View style={styles.centered}>
                 <ActivityIndicator size="large" color="royalblue" />
                 <Text style={styles.loadingText}>Loading recipes...</Text>
               </View>
              ) 
            : error 
               ? (<View style={styles.centered}>
                    <Ionicons name="alert-circle-outline" size={64} color="gray" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity
                      style={styles.retryButton}
                      onPress={fetchRandomRecipes}
                      disabled={loading}
                    >
                      <Text style={styles.retryText}>
                       {loading ? 'Loading...' : 'Try Again'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                 ) 
               : (<FlatList
                    data={recipes}
                    keyExtractor={(item) => item.recipeId.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.grid}
                    columnWrapperStyle={styles.row}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                  />
                )
          }
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'whitesmoke',
  },
  content: {
    flex: 1,
  },
  grid: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    flex: 1,
    marginBottom: 16,
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    color: 'gray',
    fontSize: 16,
    marginTop: 16,
  },
  errorText: {
    color: 'gray',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: 'royalblue',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});