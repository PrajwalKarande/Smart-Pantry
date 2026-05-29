const aiService = require('./aiService');

/**
 * Auto-categorize an ingredient using AI.
 */
async function autoCategorize(itemName) {
  console.log(`🏷️ Auto-categorizing item: ${itemName}`);

  const prompt = `
For the food ingredient "${itemName}", provide the following information in JSON format:

{
  "category": "<one of: DAIRY, VEGETABLES, FRUITS, PROTEIN, GRAINS, SPICES, BEVERAGES, CONDIMENTS, SNACKS, FROZEN, OTHER>",
  "dietaryType": "<one of: VEG, NON_VEG, VEGAN>",
  "storageTip": "<brief storage recommendation, max 100 characters>",
  "estimatedShelfLifeDays": <number of days the item typically stays fresh>
}

Rules:
- VEG = vegetarian (includes dairy, eggs)
- NON_VEG = contains meat, fish, or poultry
- VEGAN = no animal products at all
- Be practical and accurate with storage tips

IMPORTANT: Return ONLY valid JSON. No extra text or explanation.
`;

  return await aiService.askAIForJson(prompt);
}

/**
 * Get storage suggestion for a specific item.
 */
async function getStorageSuggestion(itemName) {
  console.log(`💡 Getting storage suggestion for: ${itemName}`);

  const prompt = `
Provide a brief storage recommendation (max 150 characters) for the food item "${itemName}".
Include temperature, container type, and expected shelf life.
Return ONLY the recommendation text. No JSON, no quotes.
`;

  return await aiService.askAI(prompt);
}

module.exports = {
  autoCategorize,
  getStorageSuggestion,
};
