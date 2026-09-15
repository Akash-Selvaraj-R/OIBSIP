const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrder, updatePayment } = require('../controllers/orderController');
const { auth } = require('../middleware/auth');

router.post('/', auth, createOrder);
router.get('/', auth, getOrders);
router.get('/:id', auth, getOrder);
router.post('/update-payment', auth, updatePayment);

module.exports = router;
