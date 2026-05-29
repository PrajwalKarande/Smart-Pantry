/**
 * Seed the database with sample pantry items.
 * Run: npm run seed
 */
require('dotenv').config();
const { sequelize } = require('../config/database');
const PantryItem = require('../models/PantryItem');

// Helper: get date N days from today
function daysFromNow(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

const seedItems = [
  {
    name: 'Tomatoes',
    quantity: 6,
    unit: 'pcs',
    estimated_expiry: daysFromNow(3),
    category: 'VEGETABLES',
    dietary_type: 'VEGAN',
    low_threshold: 2,
    storage_tip: 'Store at room temp. Refrigerate when ripe.',
  },
  {
    name: 'Chicken Breast',
    quantity: 2,
    unit: 'pcs',
    estimated_expiry: daysFromNow(2),
    category: 'PROTEIN',
    dietary_type: 'NON_VEG',
    low_threshold: 1,
    storage_tip: 'Refrigerate at 0-4°C. Use within 2 days.',
  },
  {
    name: 'Eggs',
    quantity: 10,
    unit: 'pcs',
    estimated_expiry: daysFromNow(14),
    category: 'PROTEIN',
    dietary_type: 'VEG',
    low_threshold: 3,
    storage_tip: 'Refrigerate. Do not wash before storing.',
  },
  {
    name: 'Rice',
    quantity: 5,
    unit: 'kg',
    estimated_expiry: daysFromNow(180),
    category: 'GRAINS',
    dietary_type: 'VEGAN',
    low_threshold: 1,
    storage_tip: 'Store in airtight container. Cool dry place.',
  },
  {
    name: 'Onions',
    quantity: 8,
    unit: 'pcs',
    estimated_expiry: daysFromNow(21),
    category: 'VEGETABLES',
    dietary_type: 'VEGAN',
    low_threshold: 3,
    storage_tip: 'Store in cool, dark, dry place. Not in fridge.',
  },
  {
    name: 'Garlic',
    quantity: 12,
    unit: 'pcs',
    estimated_expiry: daysFromNow(30),
    category: 'SPICES',
    dietary_type: 'VEGAN',
    low_threshold: 4,
    storage_tip: 'Store at room temp in ventilated area.',
  },
  {
    name: 'Milk',
    quantity: 1,
    unit: 'liter',
    estimated_expiry: daysFromNow(5),
    category: 'DAIRY',
    dietary_type: 'VEG',
    low_threshold: 1,
    storage_tip: 'Refrigerate at 2-4°C. Use within 5 days once opened.',
  },
  {
    name: 'Bread',
    quantity: 1,
    unit: 'pack',
    estimated_expiry: daysFromNow(4),
    category: 'GRAINS',
    dietary_type: 'VEG',
    low_threshold: 1,
    storage_tip: 'Store at room temp. Freeze for longer shelf life.',
  },
  {
    name: 'Butter',
    quantity: 1,
    unit: 'pack',
    estimated_expiry: daysFromNow(30),
    category: 'DAIRY',
    dietary_type: 'VEG',
    low_threshold: 1,
    storage_tip: 'Refrigerate. Keep wrapped to avoid odor absorption.',
  },
  {
    name: 'Bell Peppers',
    quantity: 3,
    unit: 'pcs',
    estimated_expiry: daysFromNow(5),
    category: 'VEGETABLES',
    dietary_type: 'VEGAN',
    low_threshold: 2,
    storage_tip: 'Refrigerate in crisper drawer. Use within a week.',
  },
  {
    name: 'Pasta',
    quantity: 3,
    unit: 'pack',
    estimated_expiry: daysFromNow(365),
    category: 'GRAINS',
    dietary_type: 'VEGAN',
    low_threshold: 1,
    storage_tip: 'Store in cool, dry place. Airtight once opened.',
  },
  {
    name: 'Cheese',
    quantity: 1,
    unit: 'pack',
    estimated_expiry: daysFromNow(7),
    category: 'DAIRY',
    dietary_type: 'VEG',
    low_threshold: 1,
    storage_tip: 'Wrap in wax paper, then plastic. Refrigerate.',
  },
  {
    name: 'Spinach',
    quantity: 1,
    unit: 'pack',
    estimated_expiry: daysFromNow(2),
    category: 'VEGETABLES',
    dietary_type: 'VEGAN',
    low_threshold: 1,
    storage_tip: 'Refrigerate in original packaging. Use quickly.',
  },
  {
    name: 'Potatoes',
    quantity: 5,
    unit: 'pcs',
    estimated_expiry: daysFromNow(21),
    category: 'VEGETABLES',
    dietary_type: 'VEGAN',
    low_threshold: 2,
    storage_tip: 'Store in cool, dark place. Do NOT refrigerate.',
  },
  {
    name: 'Yogurt',
    quantity: 2,
    unit: 'pcs',
    estimated_expiry: daysFromNow(6),
    category: 'DAIRY',
    dietary_type: 'VEG',
    low_threshold: 1,
    storage_tip: 'Refrigerate. Keep sealed. Check date before use.',
  },
];

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Connect & sync
    await sequelize.authenticate();
    console.log('✅ Database connected');

    await sequelize.sync({ force: true }); // DROP & recreate tables
    console.log('✅ Tables recreated');

    // Insert seed data
    for (const item of seedItems) {
      await PantryItem.create(item);
    }

    console.log(`✅ Seeded ${seedItems.length} pantry items`);
    console.log('🎉 Seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seed();