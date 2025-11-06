import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
import React, { useEffect, useState } from "react";
import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { searchRecipes } from "../api/spoonacular";
import HeaderFormatFor from "../../components/HeaderFormatFor";
import LoadingViewFor from "@/components/LoadingViewFor";

type Recipe = {
  id: number;
  title: string;
  image: string;
};

export default function CookbookPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<Boolean>(false);

  useEffect(() => {
    (async () => {
      const promises = Array(2).fill(null).map(() => searchRecipes("pasta"));
      const results = await Promise.all(promises)
      const allRecipes = results.flatMap(data => data.recipes || []);
      setRecipes(allRecipes);
    })();

  }, []);

  // make a setLoading function to toggle it on
  if (loading) { return (<LoadingViewFor page={"cookbook"}/>); }

  return (
    <View style={styles.container}>
      <HeaderFormatFor page="Cookbook"/>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          placeholder="Search recipes..."
          placeholderTextColor={"black"}
          style={styles.searchInput}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Featured section */}
        <Text style={styles.sectionTitle}>Featured</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092" }}
            style={styles.featuredImage}
          />
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1504674900247-0877df9cc836" }}
            style={styles.featuredImage}
          />
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1605478571920-74b90cda44bb" }}
            style={styles.featuredImage}
          />
        </ScrollView>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={styles.category}>
            <Text style={styles.categoryText}>Breakfast</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.category}>
            <Text style={styles.categoryText}>Lunch</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.category}>
            <Text style={styles.categoryText}>Dinner</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.category}>
            <Text style={styles.categoryText}>Desserts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.category}>
            <Text style={styles.categoryText}>Drinks</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScrollView>
      {/* All Recipes */}
      <Text style={styles.sectionTitle}>All Recipes</Text>
      <View style={styles.containerList}>
        <FlatList
            data={recipes}
            //numColumns={2}
            horizontal={true}
            renderItem={({ item: r }) => (
              <TouchableOpacity
                key={r.id.toString()}
                style={styles.recipeCard}
                onPress={() => router.push({ 
                  pathname: '/recipe/[id]' as const,
                  params: { id: r.id } 
                })}
                ><Image
                  source={{ uri: r.image }}
                  style={styles.recipeImage}
                />
                <Text style={styles.recipeTitle}>{r.title}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(r) => r.id.toString()}
            //columnWrapperStyle={styles.row}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Your cookbook is empty</Text>
              </View>
            }
            style={styles.recipeList}
          />
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "whitesmoke", 
    padding: 8,
  },  
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    paddingHorizontal: 10,
    margin: 20,
  },
  containerList: {
    flexDirection: "row",
    padding: 3,
  },
  searchInput: {
    color: "black",
    flex: 1,
    padding: 8,
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  featuredImage: {
    width: 200,
    height: 120,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  category: {
    backgroundColor: "#eee",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  categoryText: { fontSize: 14, fontWeight: "500" },
  recipeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  recipeList: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    paddingVertical: 10,
    width: "50%",
  },
  recipeCard: {
    width: "60%",
    justifyContent: "space-evenly",
    backgroundColor: '#eee',
    borderRadius: 10,
    padding: 5,
    overflow: 'hidden',
    elevation: 5,
  },
  recipeImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
  },
  recipeTitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "500",
    padding: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
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
    marginBottom: 75,
    justifyContent: 'center',
    padding: 16
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
});