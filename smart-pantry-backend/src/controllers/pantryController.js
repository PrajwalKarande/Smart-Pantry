const pantryService = require('../services/pantryService');

// ── GET all pantry items ──
async function getAllItems(req, res, next) {
  try {
    const items = await pantryService.getAllItems();
    // Transform snake_case to camelCase for frontend
    const transformed = items.map(transformItem);
    res.json(transformed);
  } catch (error) {
    next(error);
  }
}

// ── GET single item by ID ──
async function getItemById(req, res, next) {
  try {
    const item = await pantryService.getItemById(req.params.id);
    res.json(transformItem(item));
  } catch (error) {
    next(error);
  }
}

// ── POST — Add new item ──
async function addItem(req, res, next) {
  try {
    const item = await pantryService.addItem(req.body);
    res.status(201).json(transformItem(item));
  } catch (error) {
    next(error);
  }
}

// ── PUT — Update item ──
async function updateItem(req, res, next) {
  try {
    const item = await pantryService.updateItem(req.params.id, req.body);
    res.json(transformItem(item));
  } catch (error) {
    next(error);
  }
}

// ── DELETE — Remove item ──
async function deleteItem(req, res, next) {
  try {
    await pantryService.deleteItem(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

// ── POST — Upload text list ──
async function uploadTextList(req, res, next) {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Text content is required' });
    }
    const items = await pantryService.parseTextList(text);
    res.status(201).json(items.map(transformItem));
  } catch (error) {
    next(error);
  }
}

// ── POST — Upload image ──
async function uploadImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }
    const items = await pantryService.parseImage(req.file);
    res.status(201).json(items.map(transformItem));
  } catch (error) {
    next(error);
  }
}

// ── GET — Low stock items ──
async function getLowStockItems(req, res, next) {
  try {
    const items = await pantryService.getLowStockItemsRaw();
    // Raw query returns plain objects, transform field names
    const transformed = items.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      estimatedExpiry: item.estimated_expiry,
      category: item.category,
      dietaryType: item.dietary_type,
      lowThreshold: item.low_threshold,
      storageTip: item.storage_tip,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));
    res.json(transformed);
  } catch (error) {
    next(error);
  }
}

// ── GET — Expiring items ──
async function getExpiringItems(req, res, next) {
  try {
    const items = await pantryService.getExpiringItems();
    res.json(items.map(transformItem));
  } catch (error) {
    next(error);
  }
}

// ── Transform DB snake_case → frontend camelCase ──
function transformItem(item) {
  const data = item.dataValues || item;
  return {
    id: data.id,
    name: data.name,
    quantity: data.quantity,
    unit: data.unit,
    estimatedExpiry: data.estimated_expiry,
    category: data.category,
    dietaryType: data.dietary_type,
    lowThreshold: data.low_threshold,
    storageTip: data.storage_tip,
    createdAt: data.created_at || data.createdAt,
    updatedAt: data.updated_at || data.updatedAt,
  };
}

module.exports = {
  getAllItems,
  getItemById,
  addItem,
  updateItem,
  deleteItem,
  uploadTextList,
  uploadImage,
  getLowStockItems,
  getExpiringItems,
};