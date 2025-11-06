// app/api/spoonacular.ts
const API_KEY = process.env.EXPO_PUBLIC_SPOONACULAR_KEY;
const BASE_URL = "https://api.spoonacular.com";

export async function searchRecipes(query: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/recipes/random?apiKey=${API_KEY}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
}
export async function getRecipeInformtaion(query: number) {
  try {
    const response = await fetch(
      `${BASE_URL}/recipes/${query}/information?apiKey=${API_KEY}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching recipe information", error);
    return "";
  }
}

export async function getAnalyzedInstructions(query: number) {
  try {
    const response = await fetch(
      `${BASE_URL}/recipes/${query}/analyzedInstructions?apiKey=${API_KEY}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching recipe instructions", error)
    return "";
  }
}
