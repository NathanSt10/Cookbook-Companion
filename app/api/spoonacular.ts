import { PantryItem } from "../../hooks/usePantry";
import { PreferencesItemArray } from "../../hooks/usePreferences";

const API_KEY = '7a57ca1c0df04f84b61c31fabc928935';
const BASE_URL = "https://api.spoonacular.com";

export interface SpoonacularRecipe {
  recipeId: number;
  title: string;
  image?: string;
  cookTime?: number;
  usedIngredientCount?: number;
  missedIngredientCount?: number;
}

export interface RecipeFilters {
  query?: string;
  cuisine?: string;
  diet?: string;
  type?: string;
  cookTime?: number;
  sort?: string;
}

export async function searchRecipes(query: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/recipes/complexSearch?query=${query}&apiKey=${API_KEY}`
    );
    const data = await response.json();
    return data;
  } 
  catch (error) {
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
  } 
  catch (error) {
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
  } 
  catch (error) {
    console.error("Error fetching recipe instructions", error);
    return "";
  }
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      q.append(key, String(value));
    }
  });
  return q.toString();
}

async function spoonacularGet<T>(
  path: string,
  params: Record<string, string | number | undefined>
): Promise<T> {
  const queryString = buildQuery({ apiKey: API_KEY, ...params });
  const url = `${BASE_URL}${path}?${queryString}`;

  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text();
    console.error(`[Spoonacular] Error ${response.status}: ${text}`);
    throw new Error(`Spoonacular error ${response.status}`);
  }

  return (await response.json()) as T;
}

function normalizeRecipe(raw: any): SpoonacularRecipe {
  return {
    recipeId: raw.id,
    title: raw.title,
    image: raw.image,
    cookTime: raw.readyInMinutes ?? raw.cookTime,
    usedIngredientCount: raw.usedIngredientCount,
    missedIngredientCount: raw.missedIngredientCount,
  };
}

export async function getForYouRecipes(options: {
  preferences: PreferencesItemArray;
  pantry: PantryItem[];
  number?: number;
}): Promise<SpoonacularRecipe[]> {
  const { preferences, pantry, number = 12 } = options;

  const includeIngredients = pantry
    .map((item) => item.name?.trim().toLowerCase())
    .filter(Boolean)
    .join(', ');

  const dislikes = preferences.dislikes ?? [];
  const allergies = preferences.allergies ?? [];

  const excludeIngredients = dislikes.length > 0 
    ? dislikes.map((s) => s.toLowerCase()).join(', ') 
    : undefined;

  const intolerances = allergies.length > 0 
    ? allergies.map((s) => s.toLowerCase()).join(', ') 
    : undefined;

  const diet = preferences.dietary.length > 0 
    ? preferences.dietary.map((s) => s.toLowerCase()).join(', ')
    : undefined;

  const cuisine = preferences.cuisines.length > 0
    ? preferences.cuisines.map((s) => s.toLowerCase()).join(', ')
    : undefined;

  let cookTime: number | undefined;
  if (preferences.cookingpref.some((p) => /quick|fast/i.test(p))) {
    cookTime = 30;
  }

  const sort = includeIngredients ? 'max-used-ingredients' : 'popularity';
  
  const data = await spoonacularGet<{ results: any[] }>(
    '/recipes/complexSearch',
    {
      includeIngredients: includeIngredients || undefined,
      excludeIngredients,
      intolerances,
      diet: diet || undefined,
      cuisine,
      number,
      addRecipeInformation: 1,
      fillIngredients: 1,
      sort,
    }
  );

  return (data.results ?? []).map(normalizeRecipe);
}

export async function getFinishItRecipes(options: {
  pantry: PantryItem[];
  number?: number;
}): Promise<SpoonacularRecipe[]> {
  const { pantry, number = 12 } = options;

  const ingredients = pantry
    .slice(0, 10)
    .map((item) => item.name?.trim().toLowerCase())
    .filter(Boolean)
    .join(', ');

  if (!ingredients) { return []; }

  const data = await spoonacularGet<any[]>(
    '/recipes/findByIngredients',
    {
      ingredients,
      number,
      ranking: 1,
      ignorePantry: 'true'
    }
  );

  return (data ?? []).map(normalizeRecipe);
}

export async function getSimilarRecipes(options: {
  baseRecipeId: number;
  number?: number;
}): Promise<SpoonacularRecipe[]> {
  const { baseRecipeId, number = 10 } = options;

  const data = await spoonacularGet<any[]>(
    `/recipes/${baseRecipeId}/similar`,
    { number }
  );

  return (data ?? []).map(normalizeRecipe);
}

export async function getRandomRecipes(number = 10): Promise<SpoonacularRecipe[]> {
  const data = await spoonacularGet<{ recipes: any[] }>(
    '/recipes/random',
    { number }
  );

  return (data.recipes ?? []).map(normalizeRecipe);
}

export async function searchRecipesWithFilters(
  filters: RecipeFilters,
  number: number = 20
): Promise<SpoonacularRecipe[]> {
  const params: Record<string, string | number | undefined> = {
    number,
    addRecipeInformation: 1,
    fillIngredients: 1,
  };

  if(filters.query) { params.query = filters.query; }
  if(filters.cuisine) { params.cuisine = filters.cuisine; }
  if(filters.diet) { params.diet = filters.diet; }
  if(filters.type) { params.type = filters.type; }
  if(filters.cookTime) { params.cookTime = filters.cookTime; }
  if(filters.sort) { params.sort = filters.sort; }

  const data = await spoonacularGet<{ results: any[] }>(
    '/recipes/complexSearch',
    params
  );

  return (data.results ?? []).map(normalizeRecipe);
}