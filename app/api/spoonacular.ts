// app/api/spoonacular.ts
const API_KEY = process.env.EXPO_PUBLIC_SPOONACULAR_KEY;
const BASE_URL = "https://api.spoonacular.com";

export async function searchRecipes(query: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/recipes/random?apiKey=${API_KEY}`
    );
    const data = await response.json();
    return data.recipes;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
}
