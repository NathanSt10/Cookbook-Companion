import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
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
    <View>
      {recipes.map((r) => (
        <Text style={styles.name} key={r.id}>{r.title}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
});