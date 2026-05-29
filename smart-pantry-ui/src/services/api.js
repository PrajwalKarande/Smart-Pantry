import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000, // 60s for AI calls
});

// ── Response interceptor for error handling ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    console.error('API Error:', message);
    return Promise.reject({ message, status: error.response?.status });
  }
);

// ═══════════════════════════════════════════
//  PANTRY ENDPOINTS
// ═══════════════════════════════════════════

export const pantryApi = {
  // Get all pantry items
  getAll: () => api.get('/pantry'),

  // Get single item
  getById: (id) => api.get(`/pantry/${id}`),

  // Add new item
  add: (item) => api.post('/pantry', item),

  // Update item
  update: (id, item) => api.put(`/pantry/${id}`, item),

  // Delete item
  remove: (id) => api.delete(`/pantry/${id}`),

  // Upload text list (parse ingredients from text)
  uploadTextList: (text) => api.post('/pantry/upload/text', { text }),

  // Upload image (parse ingredients from image)
  uploadImage: (formData) =>
    api.post('/pantry/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Get low-stock items
  getLowStock: () => api.get('/pantry/low-stock'),

  // Get expiring items
  getExpiring: () => api.get('/pantry/expiring'),
};

// ═══════════════════════════════════════════
//  MEAL SUGGESTION ENDPOINTS
// ═══════════════════════════════════════════

export const mealApi = {
  // Get AI meal suggestions based on pantry
  getSuggestions: (filters = {}) =>
    api.post('/meals/suggestions', filters),

  // Get 15-minute action plan (recipe)
  getActionPlan: (mealId) =>
    api.get(`/meals/action-plan/${mealId}`),

  // Generate recipe for specific meal
  generateRecipe: (request) =>
    api.post('/meals/generate-recipe', request),

  // Get weekly meal summary
  getWeeklySummary: () =>
    api.get('/meals/weekly-summary'),

  // Get missing ingredients for a recipe
  getMissingIngredients: (recipeId) =>
    api.get(`/meals/missing-ingredients/${recipeId}`),
};

// ═══════════════════════════════════════════
//  CATEGORY / STORAGE ENDPOINTS
// ═══════════════════════════════════════════

export const categoryApi = {
  // Auto-categorize an item
  categorize: (itemName) =>
    api.post('/categories/auto-map', { itemName }),

  // Get storage suggestion
  getStorageSuggestion: (itemName) =>
    api.get(`/categories/storage-suggestion?item=${encodeURIComponent(itemName)}`),
};

export default api;