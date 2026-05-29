const request = require('supertest');
const express = require('express');

jest.mock('../../src/services/categoryService');

const categoryService = require('../../src/services/categoryService');
const errorHandler = require('../../src/middleware/errorHandler');
const categoryRoutes = require('../../src/routes/categoryRoutes');
const { mockCategoryResponse, mockStorageSuggestion } = require('../mocks/aiService.mock');

function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/categories', categoryRoutes);
  app.use(errorHandler);
  return app;
}

describe('Category Routes (Integration)', () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── POST /api/categories/auto-map ──
  describe('POST /api/categories/auto-map', () => {

    test('should return 200 with category data', async () => {
      categoryService.autoCategorize.mockResolvedValue(mockCategoryResponse);

      const res = await request(app)
        .post('/api/categories/auto-map')
        .send({ itemName: 'Banana' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('category', 'FRUITS');
      expect(res.body).toHaveProperty('dietaryType', 'VEGAN');
      expect(res.body).toHaveProperty('storageTip');
      expect(res.body).toHaveProperty('estimatedShelfLifeDays');
    });

    test('should return 400 when itemName is missing', async () => {
      const res = await request(app)
        .post('/api/categories/auto-map')
        .send({});

      expect(res.status).toBe(400);
    });

    test('should return 400 when itemName is empty', async () => {
      const res = await request(app)
        .post('/api/categories/auto-map')
        .send({ itemName: '' });

      expect(res.status).toBe(400);
    });
  });

  // ── GET /api/categories/storage-suggestion ──
  describe('GET /api/categories/storage-suggestion', () => {

    test('should return 200 with storage suggestion', async () => {
      categoryService.getStorageSuggestion.mockResolvedValue(mockStorageSuggestion);

      const res = await request(app)
        .get('/api/categories/storage-suggestion?item=Banana');

      expect(res.status).toBe(200);
    });

    test('should return 400 when item param is missing', async () => {
      const res = await request(app)
        .get('/api/categories/storage-suggestion');

      expect(res.status).toBe(400);
    });
  });
});