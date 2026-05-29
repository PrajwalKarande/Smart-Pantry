/**
 * Mock data for pantry items used across tests.
 */

// Helper: date N days from now
function daysFromNow(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

const mockPantryItems = [
  {
    id: 1,
    name: 'Tomatoes',
    quantity: 6,
    unit: 'pcs',
    estimated_expiry: daysFromNow(3),
    category: 'VEGETABLES',
    dietary_type: 'VEGAN',
    low_threshold: 2,
    storage_tip: 'Store at room temp.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    dataValues: null, // Will be set below
  },
  {
    id: 2,
    name: 'Chicken Breast',
    quantity: 2,
    unit: 'pcs',
    estimated_expiry: daysFromNow(2),
    category: 'PROTEIN',
    dietary_type: 'NON_VEG',
    low_threshold: 1,
    storage_tip: 'Refrigerate at 0-4°C.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    dataValues: null,
  },
  {
    id: 3,
    name: 'Eggs',
    quantity: 10,
    unit: 'pcs',
    estimated_expiry: daysFromNow(14),
    category: 'PROTEIN',
    dietary_type: 'VEG',
    low_threshold: 3,
    storage_tip: 'Refrigerate. Do not wash.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    dataValues: null,
  },
  {
    id: 4,
    name: 'Rice',
    quantity: 5,
    unit: 'kg',
    estimated_expiry: daysFromNow(180),
    category: 'GRAINS',
    dietary_type: 'VEGAN',
    low_threshold: 1,
    storage_tip: 'Store in airtight container.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    dataValues: null,
  },
  {
    id: 5,
    name: 'Spinach',
    quantity: 1,
    unit: 'pack',
    estimated_expiry: daysFromNow(1),
    category: 'VEGETABLES',
    dietary_type: 'VEGAN',
    low_threshold: 1,
    storage_tip: 'Refrigerate. Use quickly.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    dataValues: null,
  },
];

// Set dataValues for each (Sequelize model simulation)
mockPantryItems.forEach((item) => {
  item.dataValues = { ...item };
  delete item.dataValues.dataValues;
});

const mockNewItemInput = {
  name: 'Bananas',
  quantity: 6,
  unit: 'pcs',
  estimatedExpiry: daysFromNow(5),
  category: 'FRUITS',
  dietaryType: 'VEGAN',
  lowThreshold: 2,
  storageTip: 'Store at room temperature.',
};

const mockNewItemDB = {
  id: 6,
  name: 'Bananas',
  quantity: 6,
  unit: 'pcs',
  estimated_expiry: daysFromNow(5),
  category: 'FRUITS',
  dietary_type: 'VEGAN',
  low_threshold: 2,
  storage_tip: 'Store at room temperature.',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  dataValues: null,
};
mockNewItemDB.dataValues = { ...mockNewItemDB };
delete mockNewItemDB.dataValues.dataValues;

const mockTextUpload = `Tomatoes, 2025-07-20, 5
Chicken breast, 2025-07-15, 2
Rice, 2025-12-01, 3 kg`;

const mockParsedTextItems = [
  {
    name: 'Tomatoes',
    estimatedExpiry: '2025-07-20',
    quantity: 5,
    unit: 'pcs',
    category: 'VEGETABLES',
    dietaryType: 'VEGAN',
    storageTip: 'Store at room temp.',
  },
  {
    name: 'Chicken Breast',
    estimatedExpiry: '2025-07-15',
    quantity: 2,
    unit: 'pcs',
    category: 'PROTEIN',
    dietaryType: 'NON_VEG',
    storageTip: 'Refrigerate.',
  },
  {
    name: 'Rice',
    estimatedExpiry: '2025-12-01',
    quantity: 3,
    unit: 'kg',
    category: 'GRAINS',
    dietaryType: 'VEGAN',
    storageTip: 'Store in airtight container.',
  },
];

module.exports = {
  mockPantryItems,
  mockNewItemInput,
  mockNewItemDB,
  mockTextUpload,
  mockParsedTextItems,
  daysFromNow,
};