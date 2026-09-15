const express = require('express');
const bcrypt = require('bcrypt');
const { getDb, saveDatabase } = require('../database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const SALT_ROUNDS = 10;

function validatePassword(password) {
  if (!password || password.length < 8) return false;
  return /\d/.test(password);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post('/register', async (req, res) => {
  try {
    const db = getDb();
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (username.trim().length < 2) {
      return res.status(400).json({ error: 'Username must be at least 2 characters' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters and contain at least one number' });
    }

    const existingStmt = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?');
    existingStmt.bind([email.toLowerCase().trim(), username.trim()]);
    if (existingStmt.step()) {
      existingStmt.free();
      return res.status(409).json({ error: 'An account with this username or email already exists' });
    }
    existingStmt.free();

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const insertStmt = db.prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)');
    insertStmt.run([username.trim(), email.toLowerCase().trim(), passwordHash]);
    insertStmt.free();

    const idStmt = db.prepare('SELECT last_insert_rowid() as id');
    let userId;
    if (idStmt.step()) {
      userId = idStmt.getAsObject().id;
    }
    idStmt.free();

    saveDatabase();

    req.session.userId = userId;
    req.session.username = username.trim();

    return res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: userId,
        username: username.trim(),
        email: email.toLowerCase().trim()
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const db = getDb();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    stmt.bind([email.toLowerCase().trim()]);
    let user = null;
    if (stmt.step()) {
      user = stmt.getAsObject();
    }
    stmt.free();

    if (!user) {
      return res.status(401).json({ error: 'Invalid username/email or password.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username/email or password.' });
    }

    req.session.userId = user.id;
    req.session.username = user.username;

    return res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.clearCookie('authcore.sid');
    return res.json({ message: 'Logged out successfully' });
  });
});

router.get('/me', requireAuth, (req, res) => {
  try {
    const db = getDb();
    const stmt = db.prepare('SELECT id, username, email, created_at FROM users WHERE id = ?');
    stmt.bind([req.session.userId]);
    let user = null;
    if (stmt.step()) {
      user = stmt.getAsObject();
    }
    stmt.free();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
