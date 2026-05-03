// Run with: npm run seed
// This script populates the database with 25 Home & Decor products (Criterion 1)

require('dotenv').config();
const { sequelize, Product } = require('./models');

const products = [
  // Living Room (6)
  {
    title: 'Scandinavian Sofa 3-Seater',
    price: 85000,
    category: 'living-room',
    stock: 8,
    description: 'Minimalist light grey fabric sofa with solid oak legs. Perfect for modern living rooms.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
  },
  {
    title: 'Marble Coffee Table',
    price: 32000,
    category: 'living-room',
    stock: 12,
    description: 'Round white marble top with matte black metal base. 90cm diameter.',
    image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&q=80',
  },
  {
    title: 'Rattan Accent Chair',
    price: 18500,
    category: 'living-room',
    stock: 20,
    description: 'Handwoven rattan chair with cream cushion. Bohemian style, indoor use.',
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80',
  },
  {
    title: 'Macramé Wall Hanging',
    price: 3200,
    category: 'living-room',
    stock: 40,
    description: 'Handcrafted cotton macramé, 60×90cm. Adds a boho touch to any wall.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  },
  {
    title: 'Geometric Bookshelf',
    price: 14200,
    category: 'living-room',
    stock: 15,
    description: 'Walnut finish honeycomb wall shelves, set of 6. Easy to install.',
    image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&q=80',
  },
  {
    title: 'Velvet Throw Pillow Set',
    price: 2800,
    category: 'living-room',
    stock: 60,
    description: 'Set of 4 velvet cushion covers in terracotta, sage, cream and dusty pink. 45×45cm.',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80',
  },

  // Bedroom (5)
  {
    title: 'Japandi Platform Bed Frame',
    price: 72000,
    category: 'bedroom',
    stock: 6,
    description: 'Low-profile solid wood bed frame in natural oak. Queen size 160×200cm.',
    image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&q=80',
  },
  {
    title: 'Linen Duvet Cover Set',
    price: 9500,
    category: 'bedroom',
    stock: 35,
    description: '100% washed linen, stone-grey. Includes 1 duvet cover + 2 pillowcases. King size.',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
  },
  {
    title: 'Ceramic Bedside Lamp',
    price: 5600,
    category: 'bedroom',
    stock: 25,
    description: 'Hand-thrown ceramic base in sage green with linen drum shade. 45cm height.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80',
  },
  {
    title: 'Wooden Nightstand',
    price: 11000,
    category: 'bedroom',
    stock: 18,
    description: 'Solid mango wood nightstand with 2 drawers and cane front panels.',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80',
  },
  {
    title: 'Arched Full-Length Mirror',
    price: 16800,
    category: 'bedroom',
    stock: 10,
    description: 'Arch-top floor mirror with thin brass frame. 45×150cm. Leans or mounts.',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&q=80',
  },

  // Kitchen & Dining (5)
  {
    title: 'Handmade Ceramic Dinner Set',
    price: 12400,
    category: 'kitchen',
    stock: 22,
    description: '16-piece stoneware set for 4. Speckled white glaze with matte finish.',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&q=80',
  },
  {
    title: 'Acacia Wood Dining Table',
    price: 64000,
    category: 'kitchen',
    stock: 5,
    description: 'Live-edge acacia wood table, seats 6. Each piece is unique. 180×90cm.',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80',
  },
  {
    title: 'Woven Seagrass Placemats (Set of 4)',
    price: 1800,
    category: 'kitchen',
    stock: 55,
    description: 'Natural seagrass round placemats, 38cm diameter. Heat-resistant and eco-friendly.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
  },
  {
    title: 'Matte Black Cutlery Set',
    price: 7200,
    category: 'kitchen',
    stock: 30,
    description: '24-piece stainless steel cutlery set with matte black finish. Service for 6.',
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&q=80',
  },
  {
    title: 'Glass Pendant Light',
    price: 9800,
    category: 'kitchen',
    stock: 14,
    description: 'Amber glass globe pendant, adjustable cord up to 120cm. E27 bulb socket.',
    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&q=80',
  },

  // Bathroom (4)
  {
    title: 'Bamboo Bath Accessory Set',
    price: 4500,
    category: 'bathroom',
    stock: 40,
    description: '5-piece bamboo set: soap dispenser, toothbrush holder, cup, soap dish, tray.',
    image: 'https://images.unsplash.com/photo-1620626011761-996317702782?w=600&q=80',
  },
  {
    title: 'Turkish Cotton Towel Set',
    price: 6800,
    category: 'bathroom',
    stock: 45,
    description: 'Set of 6 (2 bath + 2 hand + 2 face). 600gsm, quick-dry, cloud white.',
    image: 'https://images.unsplash.com/photo-1583845112203-29329902332e?w=600&q=80',
  },
  {
    title: 'Terrazzo Soap Dish',
    price: 1200,
    category: 'bathroom',
    stock: 70,
    description: 'Handmade terrazzo soap dish in pink and white speckle. 12×9cm.',
    image: 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=600&q=80',
  },
  {
    title: 'Teak Wood Bath Stool',
    price: 8900,
    category: 'bathroom',
    stock: 16,
    description: 'Waterproof teak shower stool with lower shelf. 45×28×43cm.',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80',
  },

  // Decor & Accessories (5)
  {
    title: 'Dried Pampas Grass Bunch',
    price: 2200,
    category: 'decor',
    stock: 50,
    description: 'Natural dried pampas grass, 90cm tall. Sold as a bunch of 5 stems.',
    image: 'https://images.unsplash.com/photo-1601459427108-47e20d579a35?w=600&q=80',
  },
  {
    title: 'Scented Soy Candle Set',
    price: 3600,
    category: 'decor',
    stock: 65,
    description: 'Set of 3 hand-poured soy candles: cedar & vanilla, jasmine, amber & sandalwood. 200g each.',
    image: 'https://images.unsplash.com/photo-1608181831718-c9fca6a5e957?w=600&q=80',
  },
  {
    title: 'Abstract Canvas Art Print',
    price: 7500,
    category: 'decor',
    stock: 20,
    description: 'Gallery-quality canvas print, 60×80cm. Earth-tone abstract expressionism. Ready to hang.',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80',
  },
  {
    title: 'Terracotta Plant Pot Set',
    price: 4100,
    category: 'decor',
    stock: 35,
    description: 'Set of 3 hand-painted terracotta pots: 10cm, 15cm, 20cm. With drainage holes.',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80',
  },
  {
    title: 'Wicker Storage Basket Set',
    price: 5300,
    category: 'decor',
    stock: 28,
    description: 'Set of 3 handwoven wicker baskets with handles. Sizes: S/M/L. Natural tan color.',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&q=80',
  },
];

async function seed() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database connected.');

    // Delete child tables first to respect foreign key constraints
    const { OrderItem } = require('./models');
    await OrderItem.destroy({ where: {} });
    await Product.destroy({ where: {} });
    console.log('Old products cleared.');

    await Product.bulkCreate(products, { validate: true });
    console.log('Successfully seeded ' + products.length + ' Home & Decor products!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
}

seed();