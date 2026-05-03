const sequelize = require('../config/database');
const User = require('./User');
const Order = require('./Order');
const Product = require('./Product');
const OrderItem = require('./OrderItem');

// User <-> Order: one-to-many
User.hasMany(Order, { foreignKey: 'userId', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'userId' });

// Criterion 2: Order <-> Product: Many-to-Many through OrderItems
Order.belongsToMany(Product, { through: OrderItem, foreignKey: 'orderId' });
Product.belongsToMany(Order, { through: OrderItem, foreignKey: 'productId' });

// Direct associations for eager loading
OrderItem.belongsTo(Product, { foreignKey: 'productId' });
OrderItem.belongsTo(Order,   { foreignKey: 'orderId'   });
Order.hasMany(OrderItem,     { foreignKey: 'orderId'   });

module.exports = { sequelize, User, Order, Product, OrderItem };
