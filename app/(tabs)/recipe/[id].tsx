import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { getRecipeInformtaion } from "./../../api/spoonacular";

type Recipe = {
  id: number;
  title: string;
  image: string;
  readyInMinutes: string;
  servings: number;
  cookingMinutes: number;
  preparationMinutes: number;
  instructions: string;
};

export default function RecipesScreen() {
  const { id } = useLocalSearchParams();
  const [recipes, setRecipes] = useState<Recipe | null>(null);

  useEffect(() => {
    (async () => {
        const info = await getRecipeInformtaion(Number(id));
        if (info) setRecipes(info);
        else console.log('No recipe data returned');
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
            <Text style={styles.itemInfo}>Serving size: {recipes.servings}</Text>
            <Text style={styles.itemInfo}>Recipe ready in {recipes.readyInMinutes} minutes</Text>
            <Text style={styles.itemInfo}>Cooking time: {recipes.readyInMinutes} minutes</Text>
            <Text style={styles.itemInfo}>Prep time: {recipes.preparationMinutes} minutes</Text>
            <Text style={styles.itemInfo}>Instructions: {recipes.instructions}</Text>
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
});