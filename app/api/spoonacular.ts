// app/api/spoonacular.ts
const API_KEY = '80879186b20a47a08e15f9cfd6b9f590';
const BASE_URL = "https://api.spoonacular.com";

export async function searchRecipes(query: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/recipes/complexSearch?query=${query}&apiKey=${API_KEY}`
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
