const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllOrders, getOrder, updateOrderStatus, getLowStockItems } = require('../controllers/adminController');
const { getInventory, updateStock, createInventoryItem, deleteInventoryItem } = require('../controllers/inventoryController');
const { adminAuth } = require('../middleware/auth');

router.get('/dashboard', adminAuth, getDashboardStats);
router.get('/orders', adminAuth, getAllOrders);
router.get('/orders/:id', adminAuth, getOrder);
router.patch('/orders/:id/status', adminAuth, updateOrderStatus);
router.get('/inventory', adminAuth, getInventory);
router.patch('/inventory/:id', adminAuth, updateStock);
router.post('/inventory', adminAuth, createInventoryItem);
router.delete('/inventory/:id', adminAuth, deleteInventoryItem);
router.get('/low-stock', adminAuth, getLowStockItems);

module.exports = router;
