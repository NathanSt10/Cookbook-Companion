import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { searchRecipes } from "../api/spoonacular";

type Recipe = {
  id: number;
  title: string;
  image: string;
};

export default function RecipesScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    (async () => {
      const data = await searchRecipes("pasta");
      setRecipes(data.recipes);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipes</Text>
      {recipes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Your cookbook is empty</Text>
        </View>
      ) : (
        <FlatList
          data={recipes}
          renderItem={({item: r}) => (
            <View style={styles.itemCard}>
              <Text style={styles.itemName}>{r.title}</Text>
            </View>
          )}
          keyExtractor={(r) => r.id.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
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
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
});