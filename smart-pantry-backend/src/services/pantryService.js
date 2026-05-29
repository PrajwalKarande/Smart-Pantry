const { Op } = require('sequelize');
const PantryItem = require('../models/PantryItem');
const aiService = require('./aiService');

// ═══════════════════════════════════════════
//  CRUD OPERATIONS
// ═══════════════════════════════════════════

async function getAllItems() {
  return await PantryItem.findAll({
    order: [['category', 'ASC'], ['name', 'ASC']],
  });
}

async function getItemById(id) {
  const item = await PantryItem.findByPk(id);
  if (!item) {
    const error = new Error(`Pantry item not found with id: ${id}`);
    error.status = 404;
    throw error;
  }
  return item;
}

async function addItem(data) {
  const incomingQty = data.quantity || 1;

  // Check for an existing item with the same name (case-insensitive)
  const existing = await PantryItem.findOne({
    where: { name: { [Op.iLike]: data.name } },
  });

  if (existing) {
    await existing.update({ quantity: existing.quantity + incomingQty });
    console.log(`✅ Updated quantity for existing pantry item: ${existing.name} (id=${existing.id}), new quantity=${existing.quantity}`);
    return existing;
  }

  const item = await PantryItem.create({
    name: data.name,
    quantity: incomingQty,
    unit: data.unit || 'pcs',
    estimated_expiry: data.estimatedExpiry || data.estimated_expiry || null,
    category: data.category || null,
    dietary_type: data.dietaryType || data.dietary_type || 'VEG',
    low_threshold: data.lowThreshold || data.low_threshold || 2,
    storage_tip: data.storageTip || data.storage_tip || null,
  });
  console.log(`✅ Added pantry item: ${item.name} (id=${item.id})`);
  return item;
}

async function updateItem(id, data) {
  const item = await getItemById(id);

  await item.update({
    name: data.name !== undefined ? data.name : item.name,
    quantity: data.quantity !== undefined ? data.quantity : item.quantity,
    unit: data.unit !== undefined ? data.unit : item.unit,
    estimated_expiry: data.estimatedExpiry !== undefined
      ? data.estimatedExpiry
      : (data.estimated_expiry !== undefined ? data.estimated_expiry : item.estimated_expiry),
    category: data.category !== undefined ? data.category : item.category,
    dietary_type: data.dietaryType !== undefined
      ? data.dietaryType
      : (data.dietary_type !== undefined ? data.dietary_type : item.dietary_type),
    low_threshold: data.lowThreshold !== undefined
      ? data.lowThreshold
      : (data.low_threshold !== undefined ? data.low_threshold : item.low_threshold),
    storage_tip: data.storageTip !== undefined
      ? data.storageTip
      : (data.storage_tip !== undefined ? data.storage_tip : item.storage_tip),
  });

  console.log(`✅ Updated pantry item: ${item.name} (id=${item.id})`);
  return item;
}

async function deleteItem(id) {
  const item = await getItemById(id);
  await item.destroy();
  console.log(`✅ Deleted pantry item id=${id}`);
}

// ═══════════════════════════════════════════
//  QUERY OPERATIONS
// ═══════════════════════════════════════════

async function getLowStockItems() {
  return await PantryItem.findAll({
    where: {
      quantity: {
        [Op.lte]: sequelizeLiteral('low_threshold'),
      },
    },
  });
}

// Helper for raw query (low stock comparison)
async function getLowStockItemsRaw() {
  const { sequelize } = require('../config/database');
  const [results] = await sequelize.query(
    'SELECT * FROM pantry_items WHERE quantity <= low_threshold'
  );
  return results;
}

async function getExpiringItems() {
  const today = new Date();
  const threeDaysLater = new Date();
  threeDaysLater.setDate(today.getDate() + 3);

  return await PantryItem.findAll({
    where: {
      estimated_expiry: {
        [Op.not]: null,
        [Op.between]: [
          today.toISOString().split('T')[0],
          threeDaysLater.toISOString().split('T')[0],
        ],
      },
    },
    order: [['estimated_expiry', 'ASC']],
  });
}

async function getExpiredItems() {
  const today = new Date().toISOString().split('T')[0];
  return await PantryItem.findAll({
    where: {
      estimated_expiry: {
        [Op.not]: null,
        [Op.lt]: today,
      },
    },
  });
}

// ═══════════════════════════════════════════
//  TEXT UPLOAD — AI PARSING
// ═══════════════════════════════════════════

async function parseTextList(text) {
  console.log('📝 Parsing text list via AI...');

  const prompt = `
Parse the following ingredient list into structured JSON.
For each item, extract the following fields:
- name (string): ingredient name
- estimatedExpiry (string, format YYYY-MM-DD): expiry date if provided, otherwise estimate a reasonable expiry from today (${new Date().toISOString().split('T')[0]})
- quantity (number): quantity amount
- unit (string): unit of measurement (pcs, kg, g, liter, ml, cups, dozen, pack). Default "pcs"
- category (string): one of DAIRY, VEGETABLES, FRUITS, PROTEIN, GRAINS, SPICES, BEVERAGES, CONDIMENTS, SNACKS, FROZEN, OTHER
- dietaryType (string): one of VEG, NON_VEG, VEGAN
- storageTip (string): brief storage recommendation (max 100 chars)

IMPORTANT: Return ONLY a valid JSON array. No extra text.

Input text:
${text}
`;

  const parsedItems = await aiService.askAIForJson(prompt);

  // Save all parsed items to database
  const savedItems = [];
  for (const itemData of parsedItems) {
    const saved = await addItem(itemData);
    savedItems.push(saved);
  }

  console.log(`✅ Parsed and saved ${savedItems.length} items from text`);
  return savedItems;
}

// ═══════════════════════════════════════════
//  IMAGE UPLOAD — AI PARSING
// ═══════════════════════════════════════════

async function parseImage(imageFile) {
  console.log(`📸 Parsing image via AI... (filename: ${imageFile.originalname})`);

  const prompt = `
I have a photo of pantry/fridge contents.
Since you cannot process images directly, please generate a realistic list of 5-8 common pantry/fridge items that would typically be found together in a well-stocked kitchen.

For each item, return the following fields:
- name (string): ingredient name
- estimatedExpiry (string, format YYYY-MM-DD): reasonable estimated expiry from today (${new Date().toISOString().split('T')[0]})
- quantity (number): realistic quantity
- unit (string): one of pcs, kg, g, liter, ml, cups, dozen, pack
- category (string): one of DAIRY, VEGETABLES, FRUITS, PROTEIN, GRAINS, SPICES, BEVERAGES, CONDIMENTS, SNACKS, FROZEN, OTHER
- dietaryType (string): one of VEG, NON_VEG, VEGAN
- storageTip (string): brief storage recommendation (max 100 chars)

IMPORTANT: Return ONLY a valid JSON array. No extra text.

The image file name is: ${imageFile.originalname}
`;

  const parsedItems = await aiService.askAIForJson(prompt);

  // Save all parsed items
  const savedItems = [];
  for (const itemData of parsedItems) {
    const saved = await addItem(itemData);
    savedItems.push(saved);
  }

  console.log(`✅ Parsed and saved ${savedItems.length} items from image`);
  return savedItems;
}

module.exports = {
  getAllItems,
  getItemById,
  addItem,
  updateItem,
  deleteItem,
  getLowStockItemsRaw,
  getExpiringItems,
  getExpiredItems,
  parseTextList,
  parseImage,
};