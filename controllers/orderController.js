const { Order, User, Product, OrderItem } = require('../models');
const sequelize = require('../config/database');

// POST /api/orders  (protected)
// Body: { userId, items: [{ productId, quantity }, ...] }
exports.createOrder = async (req, res) => {
  // Use a transaction so stock updates are atomic
  const t = await sequelize.transaction();

  try {
    const { userId, items } = req.body;

    // Step 1: Validate input
    if (!userId || !Array.isArray(items) || items.length === 0) {
      await t.rollback();
      return res.status(400).json({ error: 'userId and a non-empty items array are required.' });
    }

    // Step 2: Verify the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      await t.rollback();
      return res.status(404).json({ error: 'User not found.' });
    }

    // Step 3: Load all requested products at once
    const productIds = items.map(i => i.productId);
    const products   = await Product.findAll({ where: { id: productIds }, transaction: t });

    if (products.length !== productIds.length) {
      await t.rollback();
      return res.status(404).json({ error: 'One or more products not found.' });
    }

    // Step 4: Criterion 5 – inventory check and stock deduction
    const productMap = {};
    for (const p of products) productMap[p.id] = p;

    let totalPrice = 0;

    for (const item of items) {
      const product = productMap[item.productId];
      if (!product) {
        await t.rollback();
        return res.status(404).json({ error: `Product ${item.productId} not found.` });
      }

      if (product.stock < item.quantity) {
        await t.rollback();
        return res.status(400).json({
          error: `Out of Stock: "${product.title}" only has ${product.stock} unit(s) left.`,
        });
      }

      totalPrice += product.price * item.quantity;
    }

    // Step 5: Create the Order
    const order = await Order.create({ userId, totalPrice }, { transaction: t });

    // Step 6: Criterion 2 – save OrderItems (junction table) and deduct stock
    for (const item of items) {
      const product = productMap[item.productId];

      await OrderItem.create(
        { orderId: order.id, productId: item.productId, quantity: item.quantity, unitPrice: product.price },
        { transaction: t }
      );

      // Subtract purchased quantity from stock
      await product.update({ stock: product.stock - item.quantity }, { transaction: t });
    }

    await t.commit();

    // Return the full order with items
    const fullOrder = await Order.findByPk(order.id, {
      include: [
        { model: OrderItem, include: [Product] },
        { model: User, attributes: ['id', 'name', 'email'] },
      ],
    });

    res.status(201).json({ message: 'Order created successfully.', order: fullOrder });

  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: 'Server error during checkout.' });
  }
};

// GET /api/orders  (admin: all orders; user: their own)
exports.getAllOrders = async (req, res) => {
  try {
    const where = req.user.role === 'admin' ? {} : { userId: req.user.id };

    const orders = await Order.findAll({
      where,
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

    // Users can only view their own orders
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order.' });
  }
};
