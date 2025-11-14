import auth from '@react-native-firebase/auth';
import { getFirestore } from "@react-native-firebase/firestore";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getAnalyzedInstructions, getRecipeInformtaion } from "./../../api/spoonacular";

type extendedIngredients = {
  id: number;
  name: string;
  amount: number;
  unit: string;
  original: string;
}

type Instructions = {
  name: string;
  steps: Steps[];
}

type Steps = {
  step: string;
  number: number;
}

type Recipe = {
  id: number;
  title: string;
  image: string;
  readyInMinutes: string;
  servings: number;
  cookingMinutes: number;
  preparationMinutes: number;
  instructions: Instructions[];
  extendedIngredients: extendedIngredients[];
};

export default function RecipesScreen() {
  const { id } = useLocalSearchParams();
  const [recipes, setRecipes] = useState<Recipe | null>(null);
  const [instructions, setInstructions] = useState<Instructions[]>([]);
  const [isInFirestore, setIsInFirestore] = useState(false);
  const user = auth().currentUser;

  if (!user) {
    console.log('User not authenticated');
  }

  useEffect(() => {
    (async () => {
      try {
        
        // First, check if recipe exists in Firestore
        const firestoreSnapshot = await getFirestore()
          .collection('Users')
          .doc(user?.uid)
          .collection('recipes')
          .where('id', '==', Number(id))
          .get();

        if (!firestoreSnapshot.empty) {
          // Recipe found in Firestore
          const firestoreData = firestoreSnapshot.docs[0].data();
          setRecipes({
            id: firestoreData.id,
            title: firestoreData.title,
            image: firestoreData.image,
            readyInMinutes: firestoreData.readyInMinutes,
            servings: firestoreData.servings,
            cookingMinutes: firestoreData.cookingMinutes,
            preparationMinutes: firestoreData.preparationMinutes,
            instructions: firestoreData.instructions,
            extendedIngredients: firestoreData.extendedIngredients
          } as Recipe);
          setIsInFirestore(true);
          console.log('Recipe loaded from Firestore');
        } else {
          // Recipe not in Firestore, fetch from API
          const info = await getRecipeInformtaion(Number(id));
          if (info) {
            setRecipes(info);
            setIsInFirestore(false);
            console.log('Recipe loaded from API');
          } else {
            console.log('No recipe data returned');
          }
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } 
    })();
  }, [id]);

  useEffect(() => {
     // Only fetch instructions from API if not already loaded from Firestore
    if (isInFirestore && instructions.length > 0) {
      console.log('Instructions already loaded from Firestore');
      return;
    }

    (async () => {
        const data = await getAnalyzedInstructions(Number(id));
      if (data) {
        setInstructions(data);
      } else {
        console.log('No instructions found');
      }
    })();
  }, [id, isInFirestore]);

  const addRecipe = async () => {
    if (isInFirestore) {
      console.log('Recipe already saved');
      return;
    }

    try {
      // Fetch instructions if not already loaded
      let instructionsToSave = instructions;
      if (instructions.length === 0) {
        const data = await getAnalyzedInstructions(Number(id));
        if (data) {
          instructionsToSave = data;
          setInstructions(data);
        }
      }

      await getFirestore()
      .collection('Users')
      .doc(user?.uid)
      .collection('recipes')
      .add({
        id: recipes?.id,
        title: recipes?.title,
        image: recipes?.image,
        readyInMinutes: recipes?.readyInMinutes,
        servings: recipes?.servings,
        cookingMinutes: recipes?.cookingMinutes,
        preparationMinutes: recipes?.preparationMinutes,
        instructions: instructionsToSave,
        extendedIngredients: recipes?.extendedIngredients
      });

      setIsInFirestore(true);
    } catch (error) {
      console.error('Error adding recipe:', error)
    }
  };

  const removeRecipe = async () => {
  try {
    // Find the document to delete
    const firestoreSnapshot = await getFirestore()
      .collection('Users')
      .doc(user?.uid)
      .collection('recipes')
      .where('id', '==', Number(id))
      .get();

    if (!firestoreSnapshot.empty) {
      // Delete the document
      await firestoreSnapshot.docs[0].ref.delete();
      setIsInFirestore(false);
      console.log('Recipe removed from Firestore');
    }
  } catch (error) {
    console.error('Error removing recipe:', error);
  }
};

  return (
    <View>
        {recipes ? (
          <ScrollView>
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{recipes.title}</Text>
            </View>
            <View style={styles.imageContainer}>
              <Image
              source={{ uri: recipes.image || "https://images.unsplash.com/photo-1600891964599-f61ba0e24092"}}
              style={styles.featuredImage}
            />
            </View>
            <View style={styles.ingredientSection}>
              <TouchableOpacity onPress={() => router.push("/cookbook")} style={styles.backButtom}>
                <Text style={styles.backText}>Return to Cookbook</Text>
              </TouchableOpacity>
              
              <Text style={styles.itemInfo}>Serving size: {recipes.servings}</Text>
              <Text style={styles.itemInfo}>Recipe ready in {recipes.readyInMinutes} minutes</Text>
              <Text style={styles.itemInfo}>Cooking time: {recipes.cookingMinutes || 'N/A'} {recipes.cookingMinutes ? 'minutes' : ''}</Text>
              <Text style={styles.itemInfo}>Prep time: {recipes.preparationMinutes || 'N/A'} {recipes.preparationMinutes ? 'minutes' : ''}</Text>
            </View>
            
            <View style={styles.ingredientSection}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              {recipes.extendedIngredients && recipes.extendedIngredients.map((ingredient) => (
                <View key={ingredient.id} style={styles.ingredientItem}>
                  <Text style={styles.ingredientText}>
                    {ingredient.original}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.ingredientSection}>
              <Text style={styles.sectionTitle}>Instructions</Text>
              {instructions?.map((instruction) => (
                <View key={instruction.name} style={styles.ingredientItem}>
                  <Text style={styles.ingredientText}>{instruction.name}</Text>
                  {instruction.steps?.map((step) => (
                    <Text key={step.number} style={[styles.ingredientText, { marginBottom: 12 }, { lineHeight: 20 }]}>
                      {step.number}. {step.step}
                    </Text>
                  ))}
                </View>
              )) || <Text style={styles.ingredientText}>No instructions available</Text>}
            </View>
              
          </View>
          
          </ScrollView>
        ) : (
          <Text>Loading Recipe...</Text>
        )}
        {isInFirestore ? (
          <TouchableOpacity   
            style={styles.removeButton}
            onPress={removeRecipe}
            activeOpacity={0.8}
          >
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity   
            style={styles.addButtom}
            onPress={addRecipe}
            activeOpacity={0.8}
          >
            <Text style={styles.addText}>+</Text>
          </TouchableOpacity>
        )}        
        
      </View>
      )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 20,
    padding: 10,
    color: '#333',
  },
  titleContainer:{
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  backButtom: {
    backgroundColor: "#333131ff",
    fontSize: 25,
    paddingVertical: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 5,
    flex: 3,
    justifyContent: "center",
    color: "#6b6969ff",
    alignSelf: "flex-start"
  },
  backText: {
    color: '#f2f2f2',
    fontSize: 20
  },
  addButtom: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addText: {
    fontSize: 32,
    color: 'ghostwhite',
    fontWeight: '300',
  },
  removeText: {
    fontSize: 18,
    color: '#f44',
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 20,
    color: '#999',
    marginBottom: 8,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemInfo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  featuredImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginHorizontal: 10,
  },
  imageContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  ingredientSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  ingredientItem: {
    paddingVertical: 4,
  },
  ingredientText: {
    fontSize: 16,
  },
  removeButton: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fee',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  removeButtonText: {
    fontSize: 18,
    color: '#f44',
  },
});