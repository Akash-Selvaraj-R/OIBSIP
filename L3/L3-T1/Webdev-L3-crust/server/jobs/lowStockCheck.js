const cron = require('node-cron');
const Inventory = require('../models/Inventory');
const { sendLowStockEmail } = require('../services/emailService');

const checkLowStock = async () => {
  try {
    const lowStockItems = await Inventory.find({
      $expr: { $lte: ['$stock', '$threshold'] },
      $or: [
        { lastLowStockAlert: { $exists: false } },
        { lastLowStockAlert: null },
        { lastLowStockAlert: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
      ]
    });

    if (lowStockItems.length > 0) {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        await sendLowStockEmail(adminEmail, lowStockItems);

        for (const item of lowStockItems) {
          item.lastLowStockAlert = new Date();
          await item.save();
        }

        console.log(`Low stock alert sent for ${lowStockItems.length} items`);
      }
    }
  } catch (error) {
    console.error('Low stock check error:', error.message);
  }
};

const startCronJobs = () => {
  cron.schedule('0 */6 * * *', checkLowStock);
  console.log('Low stock check cron job started (runs every 6 hours)');
};

module.exports = { startCronJobs, checkLowStock };
