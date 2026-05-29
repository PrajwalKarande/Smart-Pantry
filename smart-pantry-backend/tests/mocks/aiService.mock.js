/**
 * Mock AI Service — replaces real GPT-4 calls in tests.
 */

const { mockMealSuggestions, mockRecipe, mockWeeklySummary } = require('./mealData.mock');
const { mockParsedTextItems } = require('./pantryData.mock');

const mockCategoryResponse = {
  category: 'FRUITS',
  dietaryType: 'VEGAN',
  storageTip: 'Store at room temperature. Refrigerate when ripe.',
  estimatedShelfLifeDays: 5,
};

const mockStorageSuggestion = 'Store at room temperature away from direct sunlight. Refrigerate when ripe for 2-3 extra days.';

/**
 * Creates a mock AI service with jest.fn() methods.
 */
function createMockAIService() {
  return {
    askAI: jest.fn().mockResolvedValue(JSON.stringify(mockMealSuggestions)),
    askAIForJson: jest.fn().mockResolvedValue(mockMealSuggestions),
    parseJsonResponse: jest.fn().mockImplementation((raw) => JSON.parse(raw)),
  };
}

module.exports = {
  createMockAIService,
  mockCategoryResponse,
  mockStorageSuggestion,
};