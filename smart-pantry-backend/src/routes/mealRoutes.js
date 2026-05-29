const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');

router.post('/suggestions',     mealController.getMealSuggestions);
router.post('/generate-recipe', mealController.generateRecipe);
router.get('/weekly-summary',   mealController.getWeeklySummary);

module.exports = router;