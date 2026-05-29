const { mockPantryItems, mockNewItemInput, mockNewItemDB, mockParsedTextItems } = require('../../mocks/pantryData.mock');

// Mock dependencies BEFORE requiring pantryService
jest.mock('../../../src/models/PantryItem');
jest.mock('../../../src/services/aiService');
jest.mock('../../../src/config/database', () => ({
  sequelize: {
    query: jest.fn(),
    authenticate: jest.fn(),
  },
}));

const PantryItem = require('../../../src/models/PantryItem');
const aiService = require('../../../src/services/aiService');
const { sequelize } = require('../../../src/config/database');
const pantryService = require('../../../src/services/pantryService');

describe('Pantry Service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ═══════════════════════════════════════════
  //  getAllItems()
  // ═══════════════════════════════════════════

  describe('getAllItems()', () => {

    test('should return all pantry items', async () => {
      PantryItem.findAll.mockResolvedValue(mockPantryItems);

      const result = await pantryService.getAllItems();

      expect(result).toEqual(mockPantryItems);
      expect(PantryItem.findAll).toHaveBeenCalledTimes(1);
      expect(PantryItem.findAll).toHaveBeenCalledWith({
        order: [['category', 'ASC'], ['name', 'ASC']],
      });
    });

    test('should return empty array when no items exist', async () => {
      PantryItem.findAll.mockResolvedValue([]);

      const result = await pantryService.getAllItems();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  // ═══════════════════════════════════════════
  //  getItemById()
  // ═══════════════════════════════════════════

  describe('getItemById()', () => {

    test('should return item when found', async () => {
      PantryItem.findByPk.mockResolvedValue(mockPantryItems[0]);

      const result = await pantryService.getItemById(1);

      expect(result).toEqual(mockPantryItems[0]);
      expect(PantryItem.findByPk).toHaveBeenCalledWith(1);
    });

    test('should throw 404 error when item not found', async () => {
      PantryItem.findByPk.mockResolvedValue(null);

      try {
        await pantryService.getItemById(999);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toContain('not found');
        expect(error.status).toBe(404);
      }
    });
  });

  // ═══════════════════════════════════════════
  //  addItem()
  // ═══════════════════════════════════════════

  describe('addItem()', () => {

    test('should create and return new item', async () => {
      PantryItem.create.mockResolvedValue(mockNewItemDB);

      const result = await pantryService.addItem(mockNewItemInput);

      expect(result).toEqual(mockNewItemDB);
      expect(PantryItem.create).toHaveBeenCalledTimes(1);
      expect(PantryItem.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Bananas',
          quantity: 6,
          unit: 'pcs',
          category: 'FRUITS',
        })
      );
    });

    test('should use default values when fields are missing', async () => {
      const minimalInput = { name: 'Water' };
      PantryItem.create.mockResolvedValue({
        id: 7,
        name: 'Water',
        quantity: 1,
        unit: 'pcs',
        dietary_type: 'VEG',
        low_threshold: 2,
        dataValues: { id: 7, name: 'Water', quantity: 1, unit: 'pcs' },
      });

      const result = await pantryService.addItem(minimalInput);

      expect(PantryItem.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Water',
          quantity: 1,
          unit: 'pcs',
          dietary_type: 'VEG',
          low_threshold: 2,
        })
      );
    });
  });

  // ═══════════════════════════════════════════
  //  updateItem()
  // ═══════════════════════════════════════════

  describe('updateItem()', () => {

    test('should update and return item', async () => {
      const mockItem = {
        ...mockPantryItems[0],
        update: jest.fn().mockResolvedValue(true),
      };
      PantryItem.findByPk.mockResolvedValue(mockItem);

      const updateData = { name: 'Cherry Tomatoes', quantity: 10 };
      const result = await pantryService.updateItem(1, updateData);

      expect(PantryItem.findByPk).toHaveBeenCalledWith(1);
      expect(mockItem.update).toHaveBeenCalledTimes(1);
    });

    test('should throw 404 when updating non-existent item', async () => {
      PantryItem.findByPk.mockResolvedValue(null);

      try {
        await pantryService.updateItem(999, { name: 'Ghost Item' });
        fail('Should have thrown');
      } catch (error) {
        expect(error.status).toBe(404);
      }
    });
  });

  // ═══════════════════════════════════════════
  //  deleteItem()
  // ═══════════════════════════════════════════

  describe('deleteItem()', () => {

    test('should delete existing item', async () => {
      const mockItem = {
        ...mockPantryItems[0],
        destroy: jest.fn().mockResolvedValue(true),
      };
      PantryItem.findByPk.mockResolvedValue(mockItem);

      await pantryService.deleteItem(1);

      expect(PantryItem.findByPk).toHaveBeenCalledWith(1);
      expect(mockItem.destroy).toHaveBeenCalledTimes(1);
    });

    test('should throw 404 when deleting non-existent item', async () => {
      PantryItem.findByPk.mockResolvedValue(null);

      try {
        await pantryService.deleteItem(999);
        fail('Should have thrown');
      } catch (error) {
        expect(error.status).toBe(404);
      }
    });
  });

  // ═══════════════════════════════════════════
  //  getLowStockItemsRaw()
  // ═══════════════════════════════════════════

  describe('getLowStockItemsRaw()', () => {

    test('should return low stock items from raw query', async () => {
      const lowStockItems = [mockPantryItems[4]]; // Spinach qty=1, threshold=1
      sequelize.query.mockResolvedValue([lowStockItems]);

      const result = await pantryService.getLowStockItemsRaw();

      expect(result).toEqual(lowStockItems);
      expect(sequelize.query).toHaveBeenCalledWith(
        'SELECT * FROM pantry_items WHERE quantity <= low_threshold'
      );
    });
  });

  // ═══════════════════════════════════════════
  //  getExpiringItems()
  // ═══════════════════════════════════════════

  describe('getExpiringItems()', () => {

    test('should return items expiring within 3 days', async () => {
      const expiringItems = [mockPantryItems[4]]; // Spinach expires in 1 day
      PantryItem.findAll.mockResolvedValue(expiringItems);

      const result = await pantryService.getExpiringItems();

      expect(result).toEqual(expiringItems);
      expect(PantryItem.findAll).toHaveBeenCalledTimes(1);
    });
  });

  // ═══════════════════════════════════════════
  //  getExpiredItems()
  // ═══════════════════════════════════════════

  describe('getExpiredItems()', () => {

    test('should return expired items', async () => {
      PantryItem.findAll.mockResolvedValue([]);

      const result = await pantryService.getExpiredItems();

      expect(result).toEqual([]);
      expect(PantryItem.findAll).toHaveBeenCalledTimes(1);
    });
  });

  // ═══════════════════════════════════════════
  //  parseTextList()
  // ═══════════════════════════════════════════

  describe('parseTextList()', () => {

    test('should parse text and save items via AI', async () => {
      aiService.askAIForJson.mockResolvedValue(mockParsedTextItems);
      PantryItem.create.mockImplementation((data) =>
        Promise.resolve({
          id: Math.floor(Math.random() * 1000),
          ...data,
          dataValues: { id: Math.floor(Math.random() * 1000), ...data },
        })
      );

      const result = await pantryService.parseTextList('Tomatoes, 2025-07-20, 5');

      expect(aiService.askAIForJson).toHaveBeenCalledTimes(1);
      expect(aiService.askAIForJson).toHaveBeenCalledWith(
        expect.stringContaining('Tomatoes, 2025-07-20, 5')
      );
      expect(PantryItem.create).toHaveBeenCalledTimes(mockParsedTextItems.length);
      expect(result).toHaveLength(mockParsedTextItems.length);
    });
  });

  // ═══════════════════════════════════════════
  //  parseImage()
  // ═══════════════════════════════════════════

  describe('parseImage()', () => {

    test('should parse image and save items via AI', async () => {
      const mockFile = {
        originalname: 'fridge.jpg',
        buffer: Buffer.from('fake-image-data'),
      };

      const mockImageItems = [
        { name: 'Milk', quantity: 1, unit: 'liter', category: 'DAIRY', dietaryType: 'VEG' },
        { name: 'Apples', quantity: 4, unit: 'pcs', category: 'FRUITS', dietaryType: 'VEGAN' },
      ];

      aiService.askAIForJson.mockResolvedValue(mockImageItems);
      PantryItem.create.mockImplementation((data) =>
        Promise.resolve({
          id: Math.floor(Math.random() * 1000),
          ...data,
          dataValues: { id: Math.floor(Math.random() * 1000), ...data },
        })
      );

      const result = await pantryService.parseImage(mockFile);

      expect(aiService.askAIForJson).toHaveBeenCalledTimes(1);
      expect(aiService.askAIForJson).toHaveBeenCalledWith(
        expect.stringContaining('fridge.jpg')
      );
      expect(PantryItem.create).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(2);
    });
  });
});