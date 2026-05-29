const request = require('supertest');
const express = require('express');

// Mock all services before importing routes
jest.mock('../../src/services/pantryService');
jest.mock('../../src/services/aiService');
jest.mock('../../src/config/database', () => ({
  sequelize: { authenticate: jest.fn(), sync: jest.fn(), query: jest.fn() },
  testConnection: jest.fn(),
}));
jest.mock('../../src/models', () => ({
  sequelize: { sync: jest.fn() },
  PantryItem: {},
  syncDatabase: jest.fn(),
}));

const pantryService = require('../../src/services/pantryService');
const errorHandler = require('../../src/middleware/errorHandler');
const pantryRoutes = require('../../src/routes/pantryRoutes');
const { mockPantryItems, mockNewItemDB } = require('../mocks/pantryData.mock');

// Create a test Express app
function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/pantry', pantryRoutes);
  app.use(errorHandler);
  return app;
}

describe('Pantry Routes (Integration)', () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── GET /api/pantry ──
  describe('GET /api/pantry', () => {

    test('should return 200 with all items', async () => {
      pantryService.getAllItems.mockResolvedValue(mockPantryItems);

      const res = await request(app).get('/api/pantry');

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });
  });

  // ── GET /api/pantry/:id ──
  describe('GET /api/pantry/:id', () => {

    test('should return 200 with item', async () => {
      pantryService.getItemById.mockResolvedValue(mockPantryItems[0]);

      const res = await request(app).get('/api/pantry/1');

      expect(res.status).toBe(200);
    });

    test('should return 404 for non-existent item', async () => {
      const error = new Error('Not found');
      error.status = 404;
      pantryService.getItemById.mockRejectedValue(error);

      const res = await request(app).get('/api/pantry/999');

      expect(res.status).toBe(404);
    });
  });

  // ── POST /api/pantry ──
  describe('POST /api/pantry', () => {

    test('should return 201 with created item', async () => {
      pantryService.addItem.mockResolvedValue(mockNewItemDB);

      const res = await request(app)
        .post('/api/pantry')
        .send({ name: 'Bananas', quantity: 6, unit: 'pcs' });

      expect(res.status).toBe(201);
    });
  });

  // ── PUT /api/pantry/:id ──
  describe('PUT /api/pantry/:id', () => {

    test('should return 200 with updated item', async () => {
      pantryService.updateItem.mockResolvedValue(mockPantryItems[0]);

      const res = await request(app)
        .put('/api/pantry/1')
        .send({ name: 'Cherry Tomatoes', quantity: 10 });

      expect(res.status).toBe(200);
    });
  });

  // ── DELETE /api/pantry/:id ──
  describe('DELETE /api/pantry/:id', () => {

    test('should return 204 on successful delete', async () => {
      pantryService.deleteItem.mockResolvedValue(undefined);

      const res = await request(app).delete('/api/pantry/1');

      expect(res.status).toBe(204);
    });
  });

  // ── POST /api/pantry/upload/text ──
  describe('POST /api/pantry/upload/text', () => {

    test('should return 201 with parsed items', async () => {
      pantryService.parseTextList.mockResolvedValue([mockNewItemDB]);

      const res = await request(app)
        .post('/api/pantry/upload/text')
        .send({ text: 'Tomatoes, 2025-07-20, 5' });

      expect(res.status).toBe(201);
    });

    test('should return 400 when text is empty', async () => {
      const res = await request(app)
        .post('/api/pantry/upload/text')
        .send({ text: '' });

      expect(res.status).toBe(400);
    });
  });

  // ── GET /api/pantry/low-stock ──
  describe('GET /api/pantry/low-stock', () => {

    test('should return 200 with low stock items', async () => {
      pantryService.getLowStockItemsRaw.mockResolvedValue([]);

      const res = await request(app).get('/api/pantry/low-stock');

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });
  });

  // ── GET /api/pantry/expiring ──
  describe('GET /api/pantry/expiring', () => {

    test('should return 200 with expiring items', async () => {
      pantryService.getExpiringItems.mockResolvedValue([]);

      const res = await request(app).get('/api/pantry/expiring');

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });
  });
});