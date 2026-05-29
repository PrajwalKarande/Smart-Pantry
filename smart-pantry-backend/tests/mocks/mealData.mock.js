/**
 * Mock data for meals, recipes, and weekly summary.
 */

const mockMealSuggestions = [
  {
    id: 'meal_1',
    name: 'Tomato Egg Scramble',
    description: 'Quick and nutritious scrambled eggs with fresh tomatoes.',
    mealCategory: 'BREAKFAST',
    dietaryType: 'VEG',
    cookingTime: 10,
    servings: 2,
    difficulty: 'Easy',
    matchScore: 100,
    availableIngredients: ['Eggs', 'Tomatoes'],
    missingIngredients: [],
  },
  {
    id: 'meal_2',
    name: 'Chicken Fried Rice',
    description: 'Classic fried rice with chicken and vegetables.',
    mealCategory: 'LUNCH',
    dietaryType: 'NON_VEG',
    cookingTime: 15,
    servings: 2,
    difficulty: 'Easy',
    matchScore: 85,
    availableIngredients: ['Chicken Breast', 'Rice', 'Eggs'],
    missingIngredients: ['Soy Sauce'],
  },
  {
    id: 'meal_3',
    name: 'Spinach Salad',
    description: 'Fresh and healthy spinach salad with tomatoes.',
    mealCategory: 'DINNER',
    dietaryType: 'VEGAN',
    cookingTime: 5,
    servings: 1,
    difficulty: 'Easy',
    matchScore: 90,
    availableIngredients: ['Spinach', 'Tomatoes'],
    missingIngredients: ['Olive Oil'],
  },
];

const mockRecipe = {
  name: 'Tomato Egg Scramble',
  description: 'Quick and nutritious scrambled eggs with fresh tomatoes and a hint of seasoning.',
  mealCategory: 'BREAKFAST',
  dietaryType: 'VEG',
  cookingTime: 15,
  servings: 2,
  difficulty: 'Easy',
  ingredients: [
    { name: 'Eggs', quantity: '4 pcs', available: true },
    { name: 'Tomatoes', quantity: '2 pcs', available: true },
    { name: 'Salt', quantity: 'to taste', available: false },
    { name: 'Oil', quantity: '1 tbsp', available: false },
  ],
  steps: [
    { stepNumber: 1, title: 'Prep Ingredients', instruction: 'Dice tomatoes. Beat eggs in a bowl.', timeMinutes: 3 },
    { stepNumber: 2, title: 'Heat Pan', instruction: 'Heat oil in a pan over medium heat.', timeMinutes: 2 },
    { stepNumber: 3, title: 'Cook Tomatoes', instruction: 'Add diced tomatoes and cook until soft.', timeMinutes: 4 },
    { stepNumber: 4, title: 'Add Eggs', instruction: 'Pour in beaten eggs. Gently scramble.', timeMinutes: 4 },
    { stepNumber: 5, title: 'Season & Serve', instruction: 'Add salt and pepper. Serve hot.', timeMinutes: 2 },
  ],
};

const mockWeeklySummary = {
  totalMeals: 21,
  totalIngredients: 5,
  expiringCount: 2,
  shoppingListCount: 5,
  dailyPlan: {
    Monday: { breakfast: 'Tomato Egg Scramble', lunch: 'Chicken Rice', dinner: 'Spinach Salad' },
    Tuesday: { breakfast: 'Egg Toast', lunch: 'Fried Rice', dinner: 'Tomato Soup' },
    Wednesday: { breakfast: 'Scrambled Eggs', lunch: 'Rice Bowl', dinner: 'Pasta' },
    Thursday: { breakfast: 'Egg Omelette', lunch: 'Chicken Wrap', dinner: 'Stir Fry' },
    Friday: { breakfast: 'Toast & Eggs', lunch: 'Rice & Veggies', dinner: 'Pasta Marinara' },
    Saturday: { breakfast: 'Pancakes', lunch: 'Chicken Salad', dinner: 'Veggie Rice' },
    Sunday: { breakfast: 'Omelette', lunch: 'Fried Rice', dinner: 'Soup & Bread' },
  },
  shoppingList: ['Soy Sauce', 'Olive Oil', 'Bread', 'Pepper', 'Lemon'],
  usePriority: ['Spinach (expires in 1 day)', 'Chicken Breast (expires in 2 days)'],
};

const mockFilters = {
  dietaryType: 'ALL',
  urgency: 'ALL',
  mealCategory: 'ALL',
};

const mockVegFilters = {
  dietaryType: 'VEG',
  urgency: 'ALL',
  mealCategory: 'BREAKFAST',
};

const mockRecipeRequest = {
  mealName: 'Tomato Egg Scramble',
  mealCategory: 'BREAKFAST',
  availableIngredients: ['Eggs', 'Tomatoes'],
  quickMode: false,
};

const mockQuickRecipeRequest = {
  mealName: null,
  quickMode: true,
};

module.exports = {
  mockMealSuggestions,
  mockRecipe,
  mockWeeklySummary,
  mockFilters,
  mockVegFilters,
  mockRecipeRequest,
  mockQuickRecipeRequest,
};