const express = require('express');
const router = express.Router();
const { register, verifyEmail, login, forgotPassword, resetPassword, getMe } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/register', register);
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', auth, getMe);

module.exports = router;
