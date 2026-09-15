const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Pizza = require('../models/Pizza');
const Inventory = require('../models/Inventory');

const pizzas = [
  {
    name: 'Margherita',
    description: 'Classic tomato sauce, fresh mozzarella, basil leaves',
    price: 299,
    category: 'veg',
    available: true,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400'
  },
  {
    name: 'Farmhouse',
    description: 'Fresh vegetables with a blend of cheeses',
    price: 399,
    category: 'veg',
    available: true,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'
  },
  {
    name: 'Pepper Paneer',
    description: 'Spicy paneer with capsicum and onions',
    price: 349,
    category: 'veg',
    available: true,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400'
  },
  {
    name: 'BBQ Corn',
    description: 'Smoky BBQ sauce with sweet corn and cheese',
    price: 329,
    category: 'veg',
    available: true,
    image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=400'
  },
  {
    name: 'Mushroom Supreme',
    description: 'Loaded with exotic mushrooms and herbs',
    price: 379,
    category: 'veg',
    available: true,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400'
  }
];

const inventoryItems = [
  { name: 'Classic', category: 'base', stock: 50, threshold: 20, price: 30 },
  { name: 'Thin Crust', category: 'base', stock: 40, threshold: 20, price: 35 },
  { name: 'Whole Wheat', category: 'base', stock: 35, threshold: 20, price: 40 },
  { name: 'Cheese Burst', category: 'base', stock: 30, threshold: 20, price: 50 },
  { name: 'Pan', category: 'base', stock: 45, threshold: 20, price: 45 },

  { name: 'Tomato', category: 'sauce', stock: 60, threshold: 25, price: 15 },
  { name: 'White Garlic', category: 'sauce', stock: 40, threshold: 20, price: 20 },
  { name: 'Pesto', category: 'sauce', stock: 30, threshold: 15, price: 25 },
  { name: 'BBQ', category: 'sauce', stock: 35, threshold: 15, price: 20 },
  { name: 'Tandoori', category: 'sauce', stock: 25, threshold: 15, price: 25 },

  { name: 'Mozzarella', category: 'cheese', stock: 50, threshold: 20, price: 30 },
  { name: 'Cheddar', category: 'cheese', stock: 40, threshold: 20, price: 35 },
  { name: 'Parmesan', category: 'cheese', stock: 25, threshold: 15, price: 40 },
  { name: 'Provolone', category: 'cheese', stock: 20, threshold: 10, price: 35 },

  { name: 'Onion', category: 'vegetable', stock: 60, threshold: 25, price: 10 },
  { name: 'Capsicum', category: 'vegetable', stock: 50, threshold: 25, price: 15 },
  { name: 'Tomato', category: 'vegetable', stock: 55, threshold: 25, price: 10 },
  { name: 'Mushroom', category: 'vegetable', stock: 30, threshold: 15, price: 20 },
  { name: 'Corn', category: 'vegetable', stock: 45, threshold: 20, price: 15 },
  { name: 'Olives', category: 'vegetable', stock: 25, threshold: 10, price: 25 },
  { name: 'Jalapenos', category: 'vegetable', stock: 20, threshold: 10, price: 20 }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Pizza.deleteMany({});
    await Inventory.deleteMany({});

    const adminPassword = await bcrypt.hash(process.env.ADMIN_DEFAULT_PASSWORD || 'admin123', 12);
    await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@crust.com',
      password: adminPassword,
      role: 'admin',
      isVerified: true
    });
    console.log('Admin user created');

    await Pizza.insertMany(pizzas);
    console.log(`${pizzas.length} pizzas created`);

    await Inventory.insertMany(inventoryItems);
    console.log(`${inventoryItems.length} inventory items created`);

    console.log('Database seeded successfully!');
    console.log(`Admin credentials: ${process.env.ADMIN_EMAIL || 'admin@crust.com'} / ${process.env.ADMIN_DEFAULT_PASSWORD || 'admin123'}`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();
