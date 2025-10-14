import { useEffect, useState } from "react";
import { View, Text } from "react-native";
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
      setRecipes(data);
    })();
  }, []);

  return (
    <View>
      {recipes.map((r) => (
        <Text key={r.id}>{r.title}</Text>
      ))}
    </View>
  );
}
