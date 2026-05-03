const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Product title cannot be empty.' },
    },
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'Price cannot be negative.',
      },
      isFloat: { msg: 'Price must be a valid number.' },
    },
  },
  description: {
    type: DataTypes.TEXT,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'general',
  },
  // Criterion 5: stock column for inventory management
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Stock cannot be negative.',
      },
    },
  },
  image: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
});

module.exports = Product;
