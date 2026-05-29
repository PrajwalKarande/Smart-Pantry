/**
 * Global test setup.
 * Runs before all test suites.
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = 8099;
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'smartpantrydb_test';
process.env.DB_USER = 'postgres';
process.env.DB_PASSWORD = 'postgres';
process.env.AI_API_URL = 'https://ai-proxy.lab.epam.com/openai/deployments/gpt-4/chat/completions?api-version=2023-08-01-preview';
process.env.AI_API_KEY = 'test-api-key';
process.env.AI_TEMPERATURE = '0';
process.env.AI_TIMEOUT = '60000';

// Suppress console logs during tests (optional — comment out to see logs)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
// };