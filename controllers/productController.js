const { Product } = require('../models');
const { Op } = require('sequelize');

// Criterion 3: GET /api/products?page=1&limit=10&category=electronics
exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;

    const pageNum  = parseInt(page,  10);
    const limitNum = parseInt(limit, 10);
    const offset   = (pageNum - 1) * limitNum;

    // Build optional WHERE clause
    const where = {};
    if (category) {
      where.category = { [Op.iLike]: `%${category}%` }; // case-insensitive match
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit:  limitNum,
      offset,
      order:  [['createdAt', 'DESC']],
    });

    res.status(200).json({
      total:       count,
      page:        pageNum,
      limit:       limitNum,
      totalPages:  Math.ceil(count / limitNum),
      products:    rows,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product.' });
  }
};

// POST /api/products  (protected – admin only)
exports.createProduct = async (req, res) => {
  try {
    const { title, price, description, category, stock, image } = req.body;

    if (!title || price === undefined) {
      return res.status(400).json({ error: 'Title and price are required.' });
    }

    const product = await Product.create({ title, price, description, category, stock, image });
    res.status(201).json({ message: 'Product created.', product });
  } catch (error) {
    // Criterion 6: clean validation error messages
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message) });
    }
    res.status(500).json({ error: 'Failed to create product.' });
  }
};

// PUT /api/products/:id  (protected – admin only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    await product.update(req.body);
    res.status(200).json({ message: 'Product updated.', product });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message) });
    }
    res.status(500).json({ error: 'Failed to update product.' });
  }
};

// DELETE /api/products/:id  (protected – admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    await product.destroy();
    res.status(200).json({ message: 'Product deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product.' });
  }
};

// Criterion 1: POST /api/products/seed  (hidden seeding route)
exports.seedProducts = async (req, res) => {
  try {
    const products = req.body; // accepts a JSON array

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Send a non-empty JSON array of products.' });
    }

    const created = await Product.bulkCreate(products, { validate: true });
    res.status(201).json({ message: `${created.length} products seeded successfully.` });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message) });
    }
    res.status(500).json({ error: 'Seeding failed.' });
  }
};
