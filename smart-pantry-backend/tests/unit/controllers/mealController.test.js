const mealController = require('../../../src/controllers/mealController');
const mealService = require('../../../src/services/mealService');
const { mockMealSuggestions, mockRecipe, mockWeeklySummary } = require('../../mocks/mealData.mock');

jest.mock('../../../src/services/mealService');

function mockReqResNext(body = {}, params = {}, query = {}) {
  return {
    req: { body, params, query },
    res: {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    },
    next: jest.fn(),
  };
}

describe('Meal Controller', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── getMealSuggestions ──
  describe('getMealSuggestions()', () => {

    test('should return 200 with meal suggestions', async () => {
      mealService.generateSuggestions.mockResolvedValue(mockMealSuggestions);
      const { req, res, next } = mockReqResNext({ dietaryType: 'ALL', urgency: 'ALL' });

      await mealController.getMealSuggestions(req, res, next);

      expect(mealService.generateSuggestions).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledWith(mockMealSuggestions);
    });

    test('should handle empty body gracefully', async () => {
      mealService.generateSuggestions.mockResolvedValue([]);
      const { req, res, next } = mockReqResNext();

      await mealController.getMealSuggestions(req, res, next);

      expect(mealService.generateSuggestions).toHaveBeenCalledWith({});
      expect(res.json).toHaveBeenCalledWith([]);
    });

    test('should call next on error', async () => {
      const error = new Error('AI Failed');
      mealService.generateSuggestions.mockRejectedValue(error);
      const { req, res, next } = mockReqResNext();

      await mealController.getMealSuggestions(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // ── generateRecipe ──
  describe('generateRecipe()', () => {

    test('should return 200 with recipe', async () => {
      mealService.generateActionPlan.mockResolvedValue(mockRecipe);
      const { req, res, next } = mockReqResNext({ mealName: 'Tomato Egg Scramble' });

      await mealController.generateRecipe(req, res, next);

      expect(mealService.generateActionPlan).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledWith(mockRecipe);
    });

    test('should call next on error', async () => {
      const error = new Error('Recipe generation failed');
      mealService.generateActionPlan.mockRejectedValue(error);
      const { req, res, next } = mockReqResNext();

      await mealController.generateRecipe(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // ── getWeeklySummary ──
  describe('getWeeklySummary()', () => {

    test('should return 200 with weekly summary', async () => {
      mealService.generateWeeklySummary.mockResolvedValue(mockWeeklySummary);
      const { req, res, next } = mockReqResNext();

      await mealController.getWeeklySummary(req, res, next);

      expect(mealService.generateWeeklySummary).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(mockWeeklySummary);
    });

    test('should call next on error', async () => {
      const error = new Error('Summary failed');
      mealService.generateWeeklySummary.mockRejectedValue(error);
      const { req, res, next } = mockReqResNext();

      await mealController.getWeeklySummary(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});