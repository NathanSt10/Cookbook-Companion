import { Ionicons } from "@expo/vector-icons";
import auth from '@react-native-firebase/auth';
import { getFirestore } from "@react-native-firebase/firestore";
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import HeaderFormatFor from "../../utils/HeaderFormatFor";
import { searchRecipes } from "../api/spoonacular";

type Recipe = {
  id: number;
  title: string;
  image: string;
  source?: 'firestore' | 'api';
};

export default function CookbookPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const isFirstRender = useRef(true);
  const user = auth().currentUser;

  if (!user) {
    console.log('User not authenticated');
  }

  const handleSearch = ()  => {
    if (searchQuery.trim()) {
      setSearchTerm(searchQuery);
    }
  };

  useEffect(() => {
    const getUserRecipes = getFirestore()
    .collection('Users')
    .doc(user?.uid)
    .collection('recipes')
    .onSnapshot(snapshot => {
      const recipes: Recipe[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: data.id,
          title: data.title,
          image: data.image,
          source: 'firestore'
        };
      });
      setUserRecipes(recipes);
    });

    return () => getUserRecipes();
  }, []);
  

  useEffect(() => {
    // Skip the first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
    return;
    }
    (async () => {
      if (searchTerm.trim()) {
        const data = await searchRecipes(searchTerm);
        setRecipes(data.results || []);
      }
    })();
  }, [searchTerm]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <HeaderFormatFor page="Cookbook" />

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          placeholder="Search recipes..."
          placeholderTextColor={"black"}
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Featured section */}
        <Text style={styles.sectionTitle}>Discover Recipes</Text>  
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
          <View style={styles.recipeGrid}>
          <FlatList
            data={recipes}
            //numColumns={2}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
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
                <Text style={styles.emptyText}>No search results</Text>
              </View>
            }
            style={styles.recipeList}
          />
        </View>   
        {/* All Recipes */}
        <View style={styles.container}>
          <ScrollView horizontal={true}>
            <Text style={styles.sectionTitle}>Your Recipes</Text>
          </ScrollView>
        </View>
        
        <View style={styles.containerList}>
          <FlatList
            data={userRecipes}
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
            keyExtractor={(r) => `${r.source}-${r.id}`}
            //columnWrapperStyle={styles.row}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Your Cookbook is empty!</Text>
              </View>
            }
            style={styles.recipeList}
          />
        </View>
      </ScrollView>
      
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
    backgroundColor: "#dfddddff",
    borderRadius: 10,
    paddingHorizontal: 10,
    margin: 20,
  },
  containerList: {
    flex: 1,
    width: "100%",
    padding: 1,
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
    paddingHorizontal: 3,
  },
  recipeList: {
    paddingVertical: 10,
  },
  recipeCard: {
    width: 150,
    marginRight: 20,
    justifyContent: "space-evenly",
    backgroundColor: '#eee',
    borderRadius: 10,
    padding: 5,
    overflow: 'hidden',
    elevation: 7,
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
    color: "black"
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
    paddingHorizontal: 1,
  },
  addButtom: {
    backgroundColor: "#f2f2f2",
    fontSize: 25,
    paddingVertical: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    flex: 3,
    justifyContent: "center",
    color: "#6b6969ff",
    alignSelf: "flex-end"
  },
});