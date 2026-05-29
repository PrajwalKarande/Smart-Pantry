const { sequelize } = require('../config/database');
const PantryItem = require('./PantryItem');

// Sync all models with database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // alter = update tables without dropping
    console.log('✅ Database tables synced');
  } catch (error) {
    console.error('❌ Database sync failed:', error.message);
  }
};

module.exports = {
  sequelize,
  PantryItem,
  syncDatabase,
};