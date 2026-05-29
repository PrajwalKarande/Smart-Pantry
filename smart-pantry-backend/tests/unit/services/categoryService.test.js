const { mockCategoryResponse, mockStorageSuggestion } = require('../../mocks/aiService.mock');

// Mock AI Service
jest.mock('../../../src/services/aiService');
const aiService = require('../../../src/services/aiService');
const categoryService = require('../../../src/services/categoryService');

describe('Category Service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ═══════════════════════════════════════════
  //  autoCategorize()
  // ═══════════════════════════════════════════

  describe('autoCategorize()', () => {

    test('should return category info for a valid ingredient', async () => {
      aiService.askAIForJson.mockResolvedValue(mockCategoryResponse);

      const result = await categoryService.autoCategorize('Banana');

      expect(aiService.askAIForJson).toHaveBeenCalledTimes(1);
      expect(aiService.askAIForJson).toHaveBeenCalledWith(
        expect.stringContaining('Banana')
      );
      expect(result).toEqual(mockCategoryResponse);
      expect(result.category).toBe('FRUITS');
      expect(result.dietaryType).toBe('VEGAN');
      expect(result.storageTip).toBeDefined();
      expect(result.estimatedShelfLifeDays).toBe(5);
    });

    test('should include valid category options in prompt', async () => {
      aiService.askAIForJson.mockResolvedValue(mockCategoryResponse);

      await categoryService.autoCategorize('Chicken');

      const promptArg = aiService.askAIForJson.mock.calls[0][0];
      expect(promptArg).toContain('DAIRY');
      expect(promptArg).toContain('VEGETABLES');
      expect(promptArg).toContain('PROTEIN');
      expect(promptArg).toContain('VEG');
      expect(promptArg).toContain('NON_VEG');
      expect(promptArg).toContain('VEGAN');
    });

    test('should throw error when AI fails', async () => {
      aiService.askAIForJson.mockRejectedValue(new Error('AI service down'));

      await expect(categoryService.autoCategorize('Test')).rejects.toThrow('AI service down');
    });
  });

  // ═══════════════════════════════════════════
  //  getStorageSuggestion()
  // ═══════════════════════════════════════════

  describe('getStorageSuggestion()', () => {

    test('should return storage suggestion for an item', async () => {
      aiService.askAI.mockResolvedValue(mockStorageSuggestion);

      const result = await categoryService.getStorageSuggestion('Banana');

      expect(aiService.askAI).toHaveBeenCalledTimes(1);
      expect(aiService.askAI).toHaveBeenCalledWith(
        expect.stringContaining('Banana')
      );
      expect(result).toBe(mockStorageSuggestion);
    });

    test('should throw error when AI fails', async () => {
      aiService.askAI.mockRejectedValue(new Error('AI timeout'));

      await expect(categoryService.getStorageSuggestion('Test')).rejects.toThrow('AI timeout');
    });
  });
});