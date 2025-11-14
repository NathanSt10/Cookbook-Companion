import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Recipe {
  fireId: string;
  recipeId: number;
  title: string;
  image: string;
};

type RecipePickerModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
  selectedDate: string;
};

export default function RecipePickerModal({ visible, onClose, onSelectRecipe, selectedDate }: RecipePickerModalProps) {
  const [cookbookRecipes, setCookbookRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const user = auth().currentUser;

  useEffect(() => {
    if (visible && user) {
      loadCookbookRecipes();
    }
  }, [visible]);

  const loadCookbookRecipes = async () => {
    try {
      setLoading(true);
      const snapshot = await firestore()
        .collection('Users')
        .doc(user?.uid)
        .collection('recipes')
        .get();

      const recipes: Recipe[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          recipeId: data.id,
          fireId: doc.id,
          title: data.title,
          image: data.image,
        };
      });

      setCookbookRecipes(recipes);
    } catch (error) {
      console.error('Error loading cookbook:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    onSelectRecipe(recipe);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Choose Recipe</Text>
            <Text style={styles.modalSubtitle}>{selectedDate}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" style={styles.loader} />
          ) : cookbookRecipes.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No recipes in cookbook</Text>
              <Text style={styles.emptySubtext}>Add recipes to your cookbook first</Text>
            </View>
          ) : (
            <FlatList
              data={cookbookRecipes}
              keyExtractor={(item) => `cookbook-${item.recipeId}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.recipeItem}
                  onPress={() => handleSelectRecipe(item)}
                >
                  <Image source={{ uri: item.image }} style={styles.recipeImage} />
                  <Text style={styles.recipeTitle}>{item.title}</Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.recipeList}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  loader: {
    marginVertical: 40,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
  },
  recipeList: {
    padding: 16,
  },
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 12,
  },
  recipeImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  recipeTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
});