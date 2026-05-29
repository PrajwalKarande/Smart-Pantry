const axios = require('axios');

// Mock axios BEFORE importing aiService
jest.mock('axios');

// Now import aiService
const aiService = require('../../../src/services/aiService');

describe('AI Service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ═══════════════════════════════════════════
  //  askAI()
  // ═══════════════════════════════════════════

  describe('askAI()', () => {

    test('should return content from successful AI response', async () => {
      const mockResponse = {
        data: {
          choices: [
            {
              message: {
                content: '{"name": "Test Recipe"}',
              },
            },
          ],
        },
      };

      axios.post.mockResolvedValue(mockResponse);

      const result = await aiService.askAI('Test prompt');

      expect(result).toBe('{"name": "Test Recipe"}');
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          temperature: expect.any(Number),
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'user',
              content: 'Test prompt',
            }),
          ]),
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Api-Key': expect.any(String),
          }),
        })
      );
    });

    test('should throw error when AI response has no choices', async () => {
      axios.post.mockResolvedValue({
        data: { choices: [] },
      });

      await expect(aiService.askAI('Test prompt')).rejects.toThrow(
        'No content in AI response'
      );
    });

    test('should throw error when AI API returns error status', async () => {
      axios.post.mockRejectedValue({
        response: {
          status: 500,
          data: { error: 'Internal Server Error' },
        },
      });

      await expect(aiService.askAI('Test prompt')).rejects.toThrow(
        'AI API returned status 500'
      );
    });

    test('should throw error on network timeout', async () => {
      axios.post.mockRejectedValue({
        code: 'ECONNABORTED',
        message: 'timeout',
      });

      await expect(aiService.askAI('Test prompt')).rejects.toThrow(
        'AI service timed out'
      );
    });

    test('should throw error on generic network failure', async () => {
      axios.post.mockRejectedValue(new Error('Network Error'));

      await expect(aiService.askAI('Test prompt')).rejects.toThrow(
        'Failed to call AI service'
      );
    });

    test('should trim whitespace from response content', async () => {
      axios.post.mockResolvedValue({
        data: {
          choices: [{ message: { content: '  trimmed content  ' } }],
        },
      });

      const result = await aiService.askAI('Test prompt');
      expect(result).toBe('trimmed content');
    });
  });

  // ═══════════════════════════════════════════
  //  askAIForJson()
  // ═══════════════════════════════════════════

  describe('askAIForJson()', () => {

    test('should parse clean JSON response', async () => {
      const mockJson = { name: 'Test', category: 'FRUITS' };
      axios.post.mockResolvedValue({
        data: {
          choices: [{ message: { content: JSON.stringify(mockJson) } }],
        },
      });

      const result = await aiService.askAIForJson('Test prompt');
      expect(result).toEqual(mockJson);
    });

    test('should parse JSON wrapped in markdown code blocks', async () => {
      const mockJson = { name: 'Test' };
      const wrappedResponse = '```json\n' + JSON.stringify(mockJson) + '\n```';

      axios.post.mockResolvedValue({
        data: {
          choices: [{ message: { content: wrappedResponse } }],
        },
      });

      const result = await aiService.askAIForJson('Test prompt');
      expect(result).toEqual(mockJson);
    });

    test('should parse JSON wrapped in generic code blocks', async () => {
      const mockJson = [{ name: 'Item1' }];
      const wrappedResponse = '```\n' + JSON.stringify(mockJson) + '\n```';

      axios.post.mockResolvedValue({
        data: {
          choices: [{ message: { content: wrappedResponse } }],
        },
      });

      const result = await aiService.askAIForJson('Test prompt');
      expect(result).toEqual(mockJson);
    });

    test('should throw error on invalid JSON response', async () => {
      axios.post.mockResolvedValue({
        data: {
          choices: [{ message: { content: 'This is not JSON at all' } }],
        },
      });

      await expect(aiService.askAIForJson('Test prompt')).rejects.toThrow(
        'Failed to parse AI response as JSON'
      );
    });
  });

  // ═══════════════════════════════════════════
  //  parseJsonResponse()
  // ═══════════════════════════════════════════

  describe('parseJsonResponse()', () => {

    test('should parse valid JSON string', () => {
      const result = aiService.parseJsonResponse('{"key": "value"}');
      expect(result).toEqual({ key: 'value' });
    });

    test('should parse JSON array', () => {
      const result = aiService.parseJsonResponse('[1, 2, 3]');
      expect(result).toEqual([1, 2, 3]);
    });

    test('should strip ```json code blocks', () => {
      const input = '```json\n{"key": "value"}\n```';
      const result = aiService.parseJsonResponse(input);
      expect(result).toEqual({ key: 'value' });
    });

    test('should strip ``` code blocks', () => {
      const input = '```\n{"key": "value"}\n```';
      const result = aiService.parseJsonResponse(input);
      expect(result).toEqual({ key: 'value' });
    });

    test('should throw error for invalid JSON', () => {
      expect(() => aiService.parseJsonResponse('not json')).toThrow(
        'Failed to parse AI response as JSON'
      );
    });

    test('should handle JSON with extra whitespace', () => {
      const result = aiService.parseJsonResponse('   {"key": "value"}   ');
      expect(result).toEqual({ key: 'value' });
    });
  });
});