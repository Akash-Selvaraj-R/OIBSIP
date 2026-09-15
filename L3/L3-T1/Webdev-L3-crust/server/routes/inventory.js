const express = require('express');
const router = express.Router();
const { getInventory, getInventoryItem, updateStock, createInventoryItem, deleteInventoryItem } = require('../controllers/inventoryController');
const { adminAuth } = require('../middleware/auth');

router.get('/', adminAuth, getInventory);
router.get('/:id', adminAuth, getInventoryItem);
router.patch('/:id', adminAuth, updateStock);
router.post('/', adminAuth, createInventoryItem);
router.delete('/:id', adminAuth, deleteInventoryItem);

module.exports = router;
