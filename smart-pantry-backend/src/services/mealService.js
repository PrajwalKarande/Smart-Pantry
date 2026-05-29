const PantryItem = require('../models/PantryItem');
const aiService = require('./aiService');
const { Op } = require('sequelize');

// ═══════════════════════════════════════════
//  MEAL SUGGESTIONS
// ═══════════════════════════════════════════

async function generateSuggestions(filters = {}) {
  console.log('🍽️ Generating meal suggestions with filters:', filters);

  // 1. Get current pantry items
  const allItems = await PantryItem.findAll();
  if (allItems.length === 0) {
    return [];
  }

  // 2. Apply dietary filter
  let filteredItems = [...allItems];
  if (filters.dietaryType && filters.dietaryType !== 'ALL') {
    filteredItems = filteredItems.filter(
      (item) => item.dietary_type === filters.dietaryType
    );
  }

  // 3. Apply urgency filter
  const today = new Date();
  const threeDaysLater = new Date();
  threeDaysLater.setDate(today.getDate() + 3);

  if (filters.urgency === 'USE_SOON') {
    filteredItems = filteredItems.filter((item) => {
      if (!item.estimated_expiry) return false;
      const expiry = new Date(item.estimated_expiry);
      return expiry <= threeDaysLater;
    });
  } else if (filters.urgency === 'STABLE') {
    filteredItems = filteredItems.filter((item) => {
      if (!item.estimated_expiry) return true;
      const expiry = new Date(item.estimated_expiry);
      return expiry > threeDaysLater;
    });
  }

  if (filteredItems.length === 0) {
    return [];
  }

  // 4. Build ingredient list for AI prompt
  const ingredientList = filteredItems
    .map(
      (item) =>
        `- ${item.name}: ${item.quantity} ${item.unit} (expires: ${item.estimated_expiry || 'N/A'}, type: ${item.dietary_type})`
    )
    .join('\n');

  // 5. Build meal category filter
  const categoryClause =
    filters.mealCategory && filters.mealCategory !== 'ALL'
      ? `Only suggest meals in the category: ${filters.mealCategory}`
      : 'Include a mix of BREAKFAST, LUNCH, DINNER, and SNACK categories.';

  // 6. Build AI prompt
  const prompt = `
You are a professional chef and meal planning assistant.

Given these available pantry ingredients:
${ingredientList}

${categoryClause}

Suggest 6 to 8 meals that can be made using PRIMARILY these ingredients.
Prioritize ingredients that are expiring soonest to minimize food waste.

For each meal, return a JSON object with these fields:
- id (string): unique identifier like "meal_1", "meal_2", etc.
- name (string): dish name
- description (string): 1-2 sentence description
- mealCategory (string): one of BREAKFAST, LUNCH, DINNER, SNACK
- dietaryType (string): one of VEG, NON_VEG, VEGAN
- cookingTime (integer): estimated time in minutes (prefer 15-minute meals)
- servings (integer): number of servings
- difficulty (string): Easy, Medium, or Hard
- matchScore (integer): 0-100, percentage of required ingredients available in pantry
- availableIngredients (array of strings): ingredients from the pantry that are used
- missingIngredients (array of strings): additional ingredients needed but NOT in pantry (keep minimal)

IMPORTANT:
- Prioritize meals where most/all ingredients are already available (high matchScore)
- Keep missingIngredients to common staples (salt, pepper, oil) or empty
- Return ONLY a valid JSON array. No extra text.
`;

  return await aiService.askAIForJson(prompt);
}

// ═══════════════════════════════════════════
//  15-MINUTE ACTION PLAN (RECIPE)
// ═══════════════════════════════════════════

async function generateActionPlan(request) {
  console.log('👨‍🍳 Generating action plan for:', request.mealName || 'Quick recipe');

  // 1. Get current pantry
  const pantryItems = await PantryItem.findAll();

  const ingredientList = pantryItems
    .map((item) => `- ${item.name}: ${item.quantity} ${item.unit}`)
    .join('\n');

  // 2. Build the prompt
  let mealClause;

  if (request.quickMode) {
    // AI picks the best meal based on expiring items
    const expiringInfo = pantryItems
      .filter((item) => item.estimated_expiry)
      .sort((a, b) => new Date(a.estimated_expiry) - new Date(b.estimated_expiry))
      .map((item) => `- ${item.name} (expires: ${item.estimated_expiry})`)
      .join('\n');

    mealClause = `
Choose the BEST meal that uses the ingredients expiring soonest:
${expiringInfo || 'No expiry dates available. Choose any good combination.'}
`;
  } else if (request.mealName && request.mealName.trim()) {
    mealClause = `Create a recipe for: ${request.mealName}`;
  } else {
    mealClause = 'Choose the best quick meal possible with the available ingredients.';
  }

  const prompt = `
You are a professional chef. Create a detailed 15-MINUTE cooking action plan.

Available pantry ingredients:
${ingredientList}

${mealClause}

STRICT RULES:
1. Use ONLY the ingredients listed above (plus basic staples like salt, pepper, oil, water)
2. Total cooking time MUST be approximately 15 minutes
3. Steps must be practical and time-boxed

Return a JSON object with this EXACT structure:
{
  "name": "Dish Name",
  "description": "Brief appetizing description",
  "mealCategory": "BREAKFAST|LUNCH|DINNER|SNACK",
  "dietaryType": "VEG|NON_VEG|VEGAN",
  "cookingTime": 15,
  "servings": 2,
  "difficulty": "Easy|Medium|Hard",
  "ingredients": [
    {"name": "Ingredient", "quantity": "amount with unit", "available": true}
  ],
  "steps": [
    {"stepNumber": 1, "title": "Step Title", "instruction": "Detailed instruction...", "timeMinutes": 3},
    {"stepNumber": 2, "title": "Step Title", "instruction": "Detailed instruction...", "timeMinutes": 4}
  ]
}

IMPORTANT:
- Each step must have a timeMinutes field
- All step times should roughly sum to 15 minutes
- Mark ingredient "available" as true if in pantry, false if it's a basic staple assumed available
- Return ONLY valid JSON. No extra text.
`;

  return await aiService.askAIForJson(prompt);
}

// ═══════════════════════════════════════════
//  WEEKLY MEAL SUMMARY
// ═══════════════════════════════════════════

async function generateWeeklySummary() {
  console.log('📅 Generating weekly meal summary...');

  // 1. Get all pantry items
  const allItems = await PantryItem.findAll();

  if (allItems.length === 0) {
    return {
      totalMeals: 0,
      totalIngredients: 0,
      expiringCount: 0,
      shoppingListCount: 0,
      dailyPlan: {},
      shoppingList: [],
      usePriority: [],
    };
  }

  // 2. Calculate stats
  const today = new Date();
  const fiveDaysLater = new Date();
  fiveDaysLater.setDate(today.getDate() + 5);

  const expiringItems = allItems
    .filter((item) => {
      if (!item.estimated_expiry) return false;
      const expiry = new Date(item.estimated_expiry);
      return expiry >= today && expiry <= fiveDaysLater;
    })
    .sort((a, b) => new Date(a.estimated_expiry) - new Date(b.estimated_expiry));

  const usePriorityNames = expiringItems.map(
    (item) => `${item.name} (expires: ${item.estimated_expiry})`
  );

  // 3. Build ingredient list for AI
  const ingredientList = allItems
    .map(
      (item) =>
        `- ${item.name}: ${item.quantity} ${item.unit} (expires: ${item.estimated_expiry || 'N/A'}, category: ${item.category}, diet: ${item.dietary_type})`
    )
    .join('\n');

  // 4. AI prompt for weekly plan
  const prompt = `
You are a professional meal planner. Based on the current pantry inventory below,
create a realistic weekly meal plan for 7 days (Monday through Sunday).

Current pantry inventory:
${ingredientList}

Items expiring soonest (USE THESE FIRST):
${usePriorityNames.length > 0 ? usePriorityNames.join('\n') : 'None'}

Create a JSON object with this EXACT structure:
{
  "totalMeals": <total number of meals planned across the week>,
  "totalIngredients": ${allItems.length},
  "expiringCount": ${expiringItems.length},
  "shoppingListCount": <number of items to buy>,
  "dailyPlan": {
    "Monday": {"breakfast": "Meal name", "lunch": "Meal name", "dinner": "Meal name"},
    "Tuesday": {"breakfast": "Meal name", "lunch": "Meal name", "dinner": "Meal name"},
    "Wednesday": {"breakfast": "Meal name", "lunch": "Meal name", "dinner": "Meal name"},
    "Thursday": {"breakfast": "Meal name", "lunch": "Meal name", "dinner": "Meal name"},
    "Friday": {"breakfast": "Meal name", "lunch": "Meal name", "dinner": "Meal name"},
    "Saturday": {"breakfast": "Meal name", "lunch": "Meal name", "dinner": "Meal name"},
    "Sunday": {"breakfast": "Meal name", "lunch": "Meal name", "dinner": "Meal name"}
  },
  "shoppingList": ["item1", "item2", "..."],
  "usePriority": ["item1 (reason)", "item2 (reason)"]
}

RULES:
1. Use expiring ingredients FIRST in early-week meals
2. Meals should be practical, quick (15-30 min), and use pantry ingredients
3. The shopping list should contain items needed to complete the week but NOT currently in pantry
4. usePriority should list items that MUST be used within 3-5 days
5. Return ONLY valid JSON. No extra text.
`;

  return await aiService.askAIForJson(prompt);
}

module.exports = {
  generateSuggestions,
  generateActionPlan,
  generateWeeklySummary,
};