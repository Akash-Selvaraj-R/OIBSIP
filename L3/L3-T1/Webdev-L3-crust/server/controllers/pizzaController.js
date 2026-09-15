const Pizza = require('../models/Pizza');

exports.getPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find({ available: true });
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPizza = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) {
      return res.status(404).json({ error: 'Pizza not found' });
    }
    res.json(pizza);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPizza = async (req, res) => {
  try {
    const { name, description, image, price, category, available } = req.body;
    const pizza = new Pizza({ name, description, image, price, category, available });
    await pizza.save();
    res.status(201).json(pizza);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pizza) {
      return res.status(404).json({ error: 'Pizza not found' });
    }
    res.json(pizza);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndDelete(req.params.id);
    if (!pizza) {
      return res.status(404).json({ error: 'Pizza not found' });
    }
    res.json({ message: 'Pizza deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
