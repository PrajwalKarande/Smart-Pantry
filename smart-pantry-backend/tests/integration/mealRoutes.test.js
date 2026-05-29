const request = require('supertest');
const express = require('express');

jest.mock('../../src/services/mealService');
jest.mock('../../src/models/PantryItem');
jest.mock('../../src/config/database', () => ({
  sequelize: { authenticate: jest.fn(), sync: jest.fn() },
  testConnection: jest.fn(),
}));

const mealService = require('../../src/services/mealService');
const errorHandler = require('../../src/middleware/errorHandler');
const mealRoutes = require('../../src/routes/mealRoutes');
const { mockMealSuggestions, mockRecipe, mockWeeklySummary } = require('../mocks/mealData.mock');

function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/meals', mealRoutes);
  app.use(errorHandler);
  return app;
}

describe('Meal Routes (Integration)', () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── POST /api/meals/suggestions ──
  describe('POST /api/meals/suggestions', () => {

    test('should return 200 with meal suggestions', async () => {
      mealService.generateSuggestions.mockResolvedValue(mockMealSuggestions);

      const res = await request(app)
        .post('/api/meals/suggestions')
        .send({ dietaryType: 'ALL', urgency: 'ALL', mealCategory: 'ALL' });

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(3);
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('matchScore');
    });

    test('should return 200 with empty array when no matches', async () => {
      mealService.generateSuggestions.mockResolvedValue([]);

      const res = await request(app)
        .post('/api/meals/suggestions')
        .send({ dietaryType: 'VEGAN' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    test('should return 500 when AI service fails', async () => {
      mealService.generateSuggestions.mockRejectedValue(new Error('AI Error'));

      const res = await request(app)
        .post('/api/meals/suggestions')
        .send({});

      expect(res.status).toBe(500);
    });
  });

  // ── POST /api/meals/generate-recipe ──
  describe('POST /api/meals/generate-recipe', () => {

    test('should return 200 with recipe action plan', async () => {
      mealService.generateActionPlan.mockResolvedValue(mockRecipe);

      const res = await request(app)
        .post('/api/meals/generate-recipe')
        .send({ mealName: 'Tomato Egg Scramble', quickMode: false });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Tomato Egg Scramble');
      expect(res.body).toHaveProperty('steps');
      expect(res.body.steps).toHaveLength(5);
      expect(res.body).toHaveProperty('cookingTime', 15);
      expect(res.body).toHaveProperty('ingredients');
    });

    test('should return 200 with quick mode recipe', async () => {
      mealService.generateActionPlan.mockResolvedValue(mockRecipe);

      const res = await request(app)
        .post('/api/meals/generate-recipe')
        .send({ quickMode: true });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name');
    });
  });

  // ── GET /api/meals/weekly-summary ──
  describe('GET /api/meals/weekly-summary', () => {

    test('should return 200 with weekly summary', async () => {
      mealService.generateWeeklySummary.mockResolvedValue(mockWeeklySummary);

      const res = await request(app).get('/api/meals/weekly-summary');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('totalMeals', 21);
      expect(res.body).toHaveProperty('dailyPlan');
      expect(res.body.dailyPlan).toHaveProperty('Monday');
      expect(res.body).toHaveProperty('shoppingList');
      expect(res.body).toHaveProperty('usePriority');
    });

    test('should return 500 when service fails', async () => {
      mealService.generateWeeklySummary.mockRejectedValue(new Error('Failed'));

      const res = await request(app).get('/api/meals/weekly-summary');

      expect(res.status).toBe(500);
    });
  });
});