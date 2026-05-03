const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Criterion 2: Junction table for the Many-to-Many relationship
const OrderItem = sequelize.define('OrderItem', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: { args: [1], msg: 'Quantity must be at least 1.' },
    },
  },
  unitPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = OrderItem;
