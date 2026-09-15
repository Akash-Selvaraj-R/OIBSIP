const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['base', 'sauce', 'cheese', 'vegetable']
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  threshold: {
    type: Number,
    required: true,
    default: 20
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  lastLowStockAlert: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Inventory', inventorySchema);
