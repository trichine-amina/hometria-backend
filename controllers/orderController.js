const { Order, User, Product, OrderItem } = require('../models');
const sequelize = require('../config/database');

// POST /api/orders  (public - guest checkout allowed)
exports.createOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { items } = req.body;

    // Validate input
    if (!Array.isArray(items) || items.length === 0) {
      await t.rollback();
      return res.status(400).json({ error: 'A non-empty items array is required.' });
    }

    // Load all requested products
    const productIds = items.map(i => i.productId);
    const products = await Product.findAll({ where: { id: productIds }, transaction: t });

    if (products.length !== productIds.length) {
      await t.rollback();
      return res.status(404).json({ error: 'One or more products not found.' });
    }

    const productMap = {};
    for (const p of products) productMap[p.id] = p;

    let totalPrice = 0;

    // Check stock
    for (const item of items) {
      const product = productMap[item.productId];
      if (product.stock < item.quantity) {
        await t.rollback();
        return res.status(400).json({
          error: `Out of Stock: "${product.title}" only has ${product.stock} unit(s) left.`,
        });
      }
      totalPrice += product.price * item.quantity;
    }

    // Create order without userId (guest)
    const order = await Order.create({ totalPrice }, { transaction: t });

    // Save order items and deduct stock
    for (const item of items) {
      const product = productMap[item.productId];
      await OrderItem.create(
        { orderId: order.id, productId: item.productId, quantity: item.quantity, unitPrice: product.price },
        { transaction: t }
      );
      await product.update({ stock: product.stock - item.quantity }, { transaction: t });
    }

    await t.commit();

    const fullOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, include: [Product] }],
    });

    res.status(201).json({ message: 'Order created successfully.', order: fullOrder });

  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: 'Server error during checkout.' });
  }
};

// GET /api/orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: OrderItem, include: [Product] },
        { model: User, attributes: ['id', 'name', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
};

// GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: OrderItem, include: [Product] },
        { model: User, attributes: ['id', 'name', 'email'] },
      ],
    });
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order.' });
  }
};