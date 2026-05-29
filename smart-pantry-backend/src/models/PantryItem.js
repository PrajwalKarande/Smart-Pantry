const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PantryItem = sequelize.define('pantry_items', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Ingredient name is required' },
    },
  },
  quantity: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: { args: [0], msg: 'Quantity must be non-negative' },
    },
  },
  unit: {
    type: DataTypes.STRING(20),
    defaultValue: 'pcs',
  },
  estimated_expiry: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING(30),
    allowNull: true,
    validate: {
      isIn: {
        args: [[
          'DAIRY', 'VEGETABLES', 'FRUITS', 'PROTEIN', 'GRAINS',
          'SPICES', 'BEVERAGES', 'CONDIMENTS', 'SNACKS', 'FROZEN', 'OTHER',
        ]],
        msg: 'Invalid category',
      },
    },
  },
  dietary_type: {
    type: DataTypes.STRING(20),
    defaultValue: 'VEG',
    validate: {
      isIn: {
        args: [['VEG', 'NON_VEG', 'VEGAN']],
        msg: 'Dietary type must be VEG, NON_VEG, or VEGAN',
      },
    },
  },
  low_threshold: {
    type: DataTypes.INTEGER,
    defaultValue: 2,
  },
  storage_tip: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
});

module.exports = PantryItem;