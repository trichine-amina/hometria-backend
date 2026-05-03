require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const { sequelize } = require('./models');

const authRoutes    = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes   = require('./routes/orderRoutes');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'DZ-Shop API is running!' });
});

app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);

// ─── 404 fallback ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ─── Start ───────────────────────────────────────────────────
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('✅ PostgreSQL connected & tables synced.');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });
