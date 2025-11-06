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

  useEffect(() => {
    (async () => {
        const info = await getRecipeInformtaion(Number(id));
        if (info) setRecipes(info);
        else console.log('No recipe data returned');
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
        const data = await getAnalyzedInstructions(Number(id));
        if (data) setInstructions(data);
        else console.log('No instructions found');
    })();
  }, [id]);

  return (
    <View>
      <ScrollView>
        {recipes ? (
          <View style={styles.container}>
            <Text style={styles.title}>{recipes.title}</Text>
            <Image
              source={{ uri: recipes.image || "https://images.unsplash.com/photo-1600891964599-f61ba0e24092"}}
              style={styles.featuredImage}
            />
            <View style={styles.ingredientSection}>
              <TouchableOpacity onPress={() => router.push("/cookbook")}>
                <Text style={styles.backButtom}>Back to Cookbook</Text>
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
        ) : (
          <Text>Loading Recipe...</Text>
        )}
        </ScrollView>
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    padding: 10,
    color: '#333',
  },
  backButtom: {
    backgroundColor: "black",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 20,
    justifyContent: "center",
    color: "#fff",
    width: "60%",
    flex: 1,
    alignSelf: "center"
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
    width: 200,
    height: 120,
    borderRadius: 12,
    marginHorizontal: 10,
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
});