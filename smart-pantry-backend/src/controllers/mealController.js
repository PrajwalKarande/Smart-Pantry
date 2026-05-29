const mealService = require('../services/mealService');

// ── POST — Get AI meal suggestions (with filters) ──
async function getMealSuggestions(req, res, next) {
  try {
    const filters = req.body || {};
    const suggestions = await mealService.generateSuggestions(filters);
    res.json(suggestions);
  } catch (error) {
    next(error);
  }
}

// ── POST — Generate 15-minute action plan recipe ──
async function generateRecipe(req, res, next) {
  try {
    const request = req.body;
    const recipe = await mealService.generateActionPlan(request);
    res.json(recipe);
  } catch (error) {
    next(error);
  }
}

// ── GET — Weekly meal summary ──
async function getWeeklySummary(req, res, next) {
  try {
    const summary = await mealService.generateWeeklySummary();
    res.json(summary);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMealSuggestions,
  generateRecipe,
  getWeeklySummary,
};