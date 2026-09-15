const Order = require('../models/Order');
const Inventory = require('../models/Inventory');

exports.createOrder = async (req, res) => {
  try {
    const { items, customPizza, amount, deliveryAddress, phone } = req.body;

    if (customPizza) {
      const ingredientNames = [
        customPizza.base,
        customPizza.sauce,
        customPizza.cheese,
        ...(customPizza.vegetables || [])
      ].filter(Boolean);

      const inventoryItems = await Inventory.find({
        name: { $in: ingredientNames }
      });

      for (const name of ingredientNames) {
        const inv = inventoryItems.find(i => i.name === name);
        if (!inv || inv.stock <= 0) {
          return res.status(400).json({
            error: `${name} is out of stock`
          });
        }
      }

      for (const name of ingredientNames) {
        const inv = inventoryItems.find(i => i.name === name);
        if (inv) {
          inv.stock -= 1;
          await inv.save();
        }
      }
    }

    const order = new Order({
      user: req.user._id,
      items: items || [],
      customPizza: customPizza || undefined,
      amount,
      deliveryAddress,
      phone,
      status: 'Order Received',
      statusHistory: [{ status: 'Order Received', timestamp: new Date() }],
      paymentStatus: 'pending'
    });

    await order.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.razorpayOrderId = razorpayOrderId;
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    order.paymentStatus = 'completed';
    await order.save();

    res.json({ message: 'Payment verified and order confirmed', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
