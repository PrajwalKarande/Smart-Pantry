const categoryController = require('../../../src/controllers/categoryController');
const categoryService = require('../../../src/services/categoryService');
const { mockCategoryResponse, mockStorageSuggestion } = require('../../mocks/aiService.mock');

jest.mock('../../../src/services/categoryService');

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

describe('Category Controller', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── autoCategorize ──
  describe('autoCategorize()', () => {

    test('should return 200 with category data', async () => {
      categoryService.autoCategorize.mockResolvedValue(mockCategoryResponse);
      const { req, res, next } = mockReqResNext({ itemName: 'Banana' });

      await categoryController.autoCategorize(req, res, next);

      expect(categoryService.autoCategorize).toHaveBeenCalledWith('Banana');
      expect(res.json).toHaveBeenCalledWith(mockCategoryResponse);
    });

    test('should return 400 when itemName is empty', async () => {
      const { req, res, next } = mockReqResNext({ itemName: '' });

      await categoryController.autoCategorize(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Item name is required' })
      );
    });

    test('should return 400 when itemName is missing', async () => {
      const { req, res, next } = mockReqResNext({});

      await categoryController.autoCategorize(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('should call next on service error', async () => {
      const error = new Error('AI down');
      categoryService.autoCategorize.mockRejectedValue(error);
      const { req, res, next } = mockReqResNext({ itemName: 'Test' });

      await categoryController.autoCategorize(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // ── getStorageSuggestion ──
  describe('getStorageSuggestion()', () => {

    test('should return 200 with storage suggestion', async () => {
      categoryService.getStorageSuggestion.mockResolvedValue(mockStorageSuggestion);
      const { req, res, next } = mockReqResNext({}, {}, { item: 'Banana' });

      await categoryController.getStorageSuggestion(req, res, next);

      expect(categoryService.getStorageSuggestion).toHaveBeenCalledWith('Banana');
      expect(res.json).toHaveBeenCalledWith(mockStorageSuggestion);
    });

    test('should return 400 when item query param is missing', async () => {
      const { req, res, next } = mockReqResNext({}, {}, {});

      await categoryController.getStorageSuggestion(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('should return 400 when item query param is empty', async () => {
      const { req, res, next } = mockReqResNext({}, {}, { item: '  ' });

      await categoryController.getStorageSuggestion(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});