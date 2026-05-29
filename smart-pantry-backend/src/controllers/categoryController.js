const categoryService = require('../services/categoryService');

// ── POST — Auto-categorize item ──
async function autoCategorize(req, res, next) {
  try {
    const { itemName } = req.body;
    if (!itemName || !itemName.trim()) {
      return res.status(400).json({ message: 'Item name is required' });
    }
    const category = await categoryService.autoCategorize(itemName);
    res.json(category);
  } catch (error) {
    next(error);
  }
}

// ── GET — Storage suggestion ──
async function getStorageSuggestion(req, res, next) {
  try {
    const { item } = req.query;
    if (!item || !item.trim()) {
      return res.status(400).json({ message: 'Item query parameter is required' });
    }
    const suggestion = await categoryService.getStorageSuggestion(item);
    res.json(suggestion);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  autoCategorize,
  getStorageSuggestion,
};