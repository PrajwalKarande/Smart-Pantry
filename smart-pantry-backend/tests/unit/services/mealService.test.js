const { mockPantryItems } = require('../../mocks/pantryData.mock');
const { mockMealSuggestions, mockRecipe, mockWeeklySummary } = require('../../mocks/mealData.mock');

// Mock dependencies
jest.mock('../../../src/models/PantryItem');
jest.mock('../../../src/services/aiService');

const PantryItem = require('../../../src/models/PantryItem');
const aiService = require('../../../src/services/aiService');
const mealService = require('../../../src/services/mealService');

describe('Meal Service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ═══════════════════════════════════════════
  //  generateSuggestions()
  // ═══════════════════════════════════════════

  describe('generateSuggestions()', () => {

    test('should generate meal suggestions with ALL filters', async () => {
      PantryItem.findAll.mockResolvedValue(mockPantryItems);
      aiService.askAIForJson.mockResolvedValue(mockMealSuggestions);

      const filters = { dietaryType: 'ALL', urgency: 'ALL', mealCategory: 'ALL' };
      const result = await mealService.generateSuggestions(filters);

      expect(PantryItem.findAll).toHaveBeenCalledTimes(1);
      expect(aiService.askAIForJson).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockMealSuggestions);
      expect(result).toHaveLength(3);
    });

    test('should return empty array when pantry is empty', async () => {
      PantryItem.findAll.mockResolvedValue([]);

      const result = await mealService.generateSuggestions({});

      expect(result).toEqual([]);
      expect(aiService.askAIForJson).not.toHaveBeenCalled();
    });

    test('should filter by dietary type VEG', async () => {
      PantryItem.findAll.mockResolvedValue(mockPantryItems);
      aiService.askAIForJson.mockResolvedValue([mockMealSuggestions[0]]);

      const filters = { dietaryType: 'VEG', urgency: 'ALL', mealCategory: 'ALL' };
      const result = await mealService.generateSuggestions(filters);

      expect(aiService.askAIForJson).toHaveBeenCalledTimes(1);
      // Verify prompt contains filtered ingredients
      const promptArg = aiService.askAIForJson.mock.calls[0][0];
      expect(promptArg).toContain('Eggs');     // VEG item
      expect(promptArg).not.toContain('Chicken Breast'); // NON_VEG should be excluded
    });

    test('should filter by dietary type NON_VEG', async () => {
      PantryItem.findAll.mockResolvedValue(mockPantryItems);
      aiService.askAIForJson.mockResolvedValue([mockMealSuggestions[1]]);

      const filters = { dietaryType: 'NON_VEG', urgency: 'ALL', mealCategory: 'ALL' };
      const result = await mealService.generateSuggestions(filters);

      const promptArg = aiService.askAIForJson.mock.calls[0][0];
      expect(promptArg).toContain('Chicken Breast');
      expect(promptArg).not.toContain('Eggs');
    });

    test('should filter by urgency USE_SOON (expiring within 3 days)', async () => {
      PantryItem.findAll.mockResolvedValue(mockPantryItems);
      aiService.askAIForJson.mockResolvedValue([mockMealSuggestions[2]]);

      const filters = { dietaryType: 'ALL', urgency: 'USE_SOON', mealCategory: 'ALL' };
      const result = await mealService.generateSuggestions(filters);

      expect(aiService.askAIForJson).toHaveBeenCalledTimes(1);
      // Only expiring items should be in the prompt
      const promptArg = aiService.askAIForJson.mock.calls[0][0];
      expect(promptArg).toContain('Spinach');   // Expires in 1 day
      expect(promptArg).toContain('Chicken Breast'); // Expires in 2 days
    });

    test('should filter by urgency STABLE', async () => {
      PantryItem.findAll.mockResolvedValue(mockPantryItems);
      aiService.askAIForJson.mockResolvedValue([mockMealSuggestions[0]]);

      const filters = { dietaryType: 'ALL', urgency: 'STABLE', mealCategory: 'ALL' };
      const result = await mealService.generateSuggestions(filters);

      expect(aiService.askAIForJson).toHaveBeenCalledTimes(1);
      const promptArg = aiService.askAIForJson.mock.calls[0][0];
      expect(promptArg).toContain('Eggs');  // Stable (expires in 14 days)
      expect(promptArg).toContain('Rice');  // Stable (expires in 180 days)
    });

    test('should filter by specific meal category', async () => {
      PantryItem.findAll.mockResolvedValue(mockPantryItems);
      aiService.askAIForJson.mockResolvedValue([mockMealSuggestions[0]]);

      const filters = { dietaryType: 'ALL', urgency: 'ALL', mealCategory: 'BREAKFAST' };
      const result = await mealService.generateSuggestions(filters);

      const promptArg = aiService.askAIForJson.mock.calls[0][0];
      expect(promptArg).toContain('BREAKFAST');
    });

    test('should return empty when filters exclude all items', async () => {
      // Only NON_VEG item is Chicken Breast, which expires in 2 days
      // Filtering NON_VEG + STABLE should return nothing
      PantryItem.findAll.mockResolvedValue(mockPantryItems);

      const filters = { dietaryType: 'NON_VEG', urgency: 'STABLE', mealCategory: 'ALL' };
      const result = await mealService.generateSuggestions(filters);

      expect(result).toEqual([]);
      expect(aiService.askAIForJson).not.toHaveBeenCalled();
    });
  });

  // ═══════════════════════════════════════════
  //  generateActionPlan()
  // ═══════════════════════════════════════════

  describe('generateActionPlan()', () => {

    test('should generate recipe for specific meal name', async () => {
      PantryItem.findAll.mockResolvedValue(mockPantryItems);
      aiService.askAIForJson.mockResolvedValue(mockRecipe);

      const request = {
        mealName: 'Tomato Egg Scramble',
        quickMode: false,
      };

      const result = await mealService.generateActionPlan(request);

      expect(PantryItem.findAll).toHaveBeenCalledTimes(1);
      expect(aiService.askAIForJson).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockRecipe);
      expect(result.name).toBe('Tomato Egg Scramble');
      expect(result.steps).toHaveLength(5);
      expect(result.cookingTime).toBe(15);

      // Verify prompt mentions the meal name
      const promptArg = aiService.askAIForJson.mock.calls[0][0];
      expect(promptArg).toContain('Tomato Egg Scramble');
    });

    test('should generate quick recipe (quickMode=true)', async () => {
      PantryItem.findAll.mockResolvedValue(mockPantryItems);
      aiService.askAIForJson.mockResolvedValue(mockRecipe);

      const request = { mealName: null, quickMode: true };

      const result = await mealService.generateActionPlan(request);

      const promptArg = aiService.askAIForJson.mock.calls[0][0];
      expect(promptArg).toContain('expiring soonest');
      expect(result).toEqual(mockRecipe);
    });

    test('should handle empty meal name (AI picks best)', async () => {
      PantryItem.findAll.mockResolvedValue(mockPantryItems);
      aiService.askAIForJson.mockResolvedValue(mockRecipe);

      const request = { mealName: '', quickMode: false };

      const result = await mealService.generateActionPlan(request);

      const promptArg = aiService.askAIForJson.mock.calls[0][0];
      expect(promptArg).toContain('best quick meal');
    });

    test('should include all pantry ingredients in prompt', async () => {
      PantryItem.findAll.mockResolvedValue(mockPantryItems);
      aiService.askAIForJson.mockResolvedValue(mockRecipe);

      await mealService.generateActionPlan({ mealName: 'Test', quickMode: false });

      const promptArg = aiService.askAIForJson.mock.calls[0][0];
      expect(promptArg).toContain('Tomatoes');
      expect(promptArg).toContain('Chicken Breast');
      expect(promptArg).toContain('Eggs');
      expect(promptArg).toContain('Rice');
      expect(promptArg).toContain('Spinach');
    });
  });

  // ═══════════════════════════════════════════
  //  generateWeeklySummary()
  // ═══════════════════════════════════════════

  describe('generateWeeklySummary()', () => {

    test('should generate weekly summary', async () => {
      PantryItem.findAll.mockResolvedValue(mockPantryItems);
      aiService.askAIForJson.mockResolvedValue(mockWeeklySummary);

      const result = await mealService.generateWeeklySummary();

      expect(PantryItem.findAll).toHaveBeenCalledTimes(1);
      expect(aiService.askAIForJson).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockWeeklySummary);
      expect(result.totalMeals).toBe(21);
      expect(result.dailyPlan).toHaveProperty('Monday');
      expect(result.dailyPlan).toHaveProperty('Sunday');
      expect(result.shoppingList.length).toBeGreaterThan(0);
    });

    test('should return empty summary when pantry is empty', async () => {
      PantryItem.findAll.mockResolvedValue([]);

      const result = await mealService.generateWeeklySummary();

      expect(result.totalMeals).toBe(0);
      expect(result.totalIngredients).toBe(0);
      expect(result.dailyPlan).toEqual({});
      expect(result.shoppingList).toEqual([]);
      expect(aiService.askAIForJson).not.toHaveBeenCalled();
    });

    test('should include expiring items in priority list', async () => {
      PantryItem.findAll.mockResolvedValue(mockPantryItems);
      aiService.askAIForJson.mockResolvedValue(mockWeeklySummary);

      await mealService.generateWeeklySummary();

      const promptArg = aiService.askAIForJson.mock.calls[0][0];
      expect(promptArg).toContain('Spinach');        // Expires in 1 day
      expect(promptArg).toContain('Chicken Breast');  // Expires in 2 days
    });
  });
});