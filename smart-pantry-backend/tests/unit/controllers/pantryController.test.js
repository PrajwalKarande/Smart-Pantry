const pantryController = require('../../../src/controllers/pantryController');
const pantryService = require('../../../src/services/pantryService');
const { mockPantryItems, mockNewItemDB } = require('../../mocks/pantryData.mock');

// Mock pantry service
jest.mock('../../../src/services/pantryService');

// Helper: mock Express req, res, next
function mockReqResNext(body = {}, params = {}, query = {}, file = null) {
  return {
    req: { body, params, query, file },
    res: {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    },
    next: jest.fn(),
  };
}

describe('Pantry Controller', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── getAllItems ──
  describe('getAllItems()', () => {

    test('should return 200 with all items', async () => {
      pantryService.getAllItems.mockResolvedValue(mockPantryItems);
      const { req, res, next } = mockReqResNext();

      await pantryController.getAllItems(req, res, next);

      expect(pantryService.getAllItems).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();
    });

    test('should call next on error', async () => {
      const error = new Error('DB Error');
      pantryService.getAllItems.mockRejectedValue(error);
      const { req, res, next } = mockReqResNext();

      await pantryController.getAllItems(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // ── getItemById ──
  describe('getItemById()', () => {

    test('should return 200 with single item', async () => {
      pantryService.getItemById.mockResolvedValue(mockPantryItems[0]);
      const { req, res, next } = mockReqResNext({}, { id: 1 });

      await pantryController.getItemById(req, res, next);

      expect(pantryService.getItemById).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledTimes(1);
    });

    test('should call next when item not found', async () => {
      const error = new Error('Not found');
      error.status = 404;
      pantryService.getItemById.mockRejectedValue(error);
      const { req, res, next } = mockReqResNext({}, { id: 999 });

      await pantryController.getItemById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // ── addItem ──
  describe('addItem()', () => {

    test('should return 201 with created item', async () => {
      pantryService.addItem.mockResolvedValue(mockNewItemDB);
      const { req, res, next } = mockReqResNext({ name: 'Bananas', quantity: 6 });

      await pantryController.addItem(req, res, next);

      expect(pantryService.addItem).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });

  // ── updateItem ──
  describe('updateItem()', () => {

    test('should return 200 with updated item', async () => {
      pantryService.updateItem.mockResolvedValue(mockPantryItems[0]);
      const { req, res, next } = mockReqResNext({ name: 'Updated' }, { id: 1 });

      await pantryController.updateItem(req, res, next);

      expect(pantryService.updateItem).toHaveBeenCalledWith(1, { name: 'Updated' });
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });

  // ── deleteItem ──
  describe('deleteItem()', () => {

    test('should return 204 no content', async () => {
      pantryService.deleteItem.mockResolvedValue(undefined);
      const { req, res, next } = mockReqResNext({}, { id: 1 });

      await pantryController.deleteItem(req, res, next);

      expect(pantryService.deleteItem).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });

  // ── uploadTextList ──
  describe('uploadTextList()', () => {

    test('should return 201 with parsed items', async () => {
      pantryService.parseTextList.mockResolvedValue([mockNewItemDB]);
      const { req, res, next } = mockReqResNext({ text: 'Tomatoes, 2025-07-20, 5' });

      await pantryController.uploadTextList(req, res, next);

      expect(pantryService.parseTextList).toHaveBeenCalledWith('Tomatoes, 2025-07-20, 5');
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('should return 400 when text is empty', async () => {
      const { req, res, next } = mockReqResNext({ text: '' });

      await pantryController.uploadTextList(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Text content is required' })
      );
    });

    test('should return 400 when text is missing', async () => {
      const { req, res, next } = mockReqResNext({});

      await pantryController.uploadTextList(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  // ── uploadImage ──
  describe('uploadImage()', () => {

    test('should return 201 with parsed items from image', async () => {
      pantryService.parseImage.mockResolvedValue([mockNewItemDB]);
      const mockFile = { originalname: 'fridge.jpg', buffer: Buffer.from('img') };
      const { req, res, next } = mockReqResNext({}, {}, {}, mockFile);
      req.file = mockFile;

      await pantryController.uploadImage(req, res, next);

      expect(pantryService.parseImage).toHaveBeenCalledWith(mockFile);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('should return 400 when no file uploaded', async () => {
      const { req, res, next } = mockReqResNext();
      req.file = null;

      await pantryController.uploadImage(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Image file is required' })
      );
    });
  });

  // ── getLowStockItems ──
  describe('getLowStockItems()', () => {

    test('should return 200 with low stock items', async () => {
      pantryService.getLowStockItemsRaw.mockResolvedValue([mockPantryItems[4]]);
      const { req, res, next } = mockReqResNext();

      await pantryController.getLowStockItems(req, res, next);

      expect(pantryService.getLowStockItemsRaw).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });

  // ── getExpiringItems ──
  describe('getExpiringItems()', () => {

    test('should return 200 with expiring items', async () => {
      pantryService.getExpiringItems.mockResolvedValue([mockPantryItems[4]]);
      const { req, res, next } = mockReqResNext();

      await pantryController.getExpiringItems(req, res, next);

      expect(pantryService.getExpiringItems).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });
});