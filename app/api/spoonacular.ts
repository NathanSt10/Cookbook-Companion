// app/api/spoonacular.ts
const API_KEY = "56f7f243462849a3a59771dc4605a43a";
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
