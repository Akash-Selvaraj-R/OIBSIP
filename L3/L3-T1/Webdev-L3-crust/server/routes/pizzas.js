const express = require('express');
const router = express.Router();
const { getPizzas, getPizza, createPizza, updatePizza, deletePizza } = require('../controllers/pizzaController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', getPizzas);
router.get('/:id', getPizza);
router.post('/', adminAuth, createPizza);
router.put('/:id', adminAuth, updatePizza);
router.delete('/:id', adminAuth, deletePizza);

module.exports = router;
