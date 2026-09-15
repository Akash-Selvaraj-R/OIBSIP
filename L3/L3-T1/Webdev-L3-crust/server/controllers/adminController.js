const Order = require('../models/Order');
const User = require('../models/User');
const Inventory = require('../models/Inventory');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const ordersReceived = await Order.countDocuments({ status: 'Order Received' });
    const inKitchen = await Order.countDocuments({ status: 'In Kitchen' });
    const sentToDelivery = await Order.countDocuments({ status: 'Sent to Delivery' });
    const totalUsers = await User.countDocuments({ role: 'user' });
    const lowStockItems = await Inventory.countDocuments({
      $expr: { $lte: ['$stock', '$threshold'] }
    });

    res.json({
      totalOrders,
      ordersReceived,
      inKitchen,
      sentToDelivery,
      totalUsers,
      lowStockItems
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Order Received', 'In Kitchen', 'Sent to Delivery'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    order.statusHistory.push({ status, timestamp: new Date() });
    await order.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`user_${order.user}`).emit('orderStatusUpdate', {
        orderId: order._id,
        status: order.status,
        updatedAt: order.updatedAt
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLowStockItems = async (req, res) => {
  try {
    const items = await Inventory.find({
      $expr: { $lte: ['$stock', '$threshold'] }
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
