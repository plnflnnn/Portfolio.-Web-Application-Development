const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const { generateToken } = require('../utils/auth');

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    if (existing.rows.length > 0)
      return res.status(409).json({ error: 'Email already taken' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date();
    const result = await pool.query(
      `INSERT INTO users ("userName", email, password, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, "userName", email`,
      [userName, email, hashedPassword, now, now]
    );

    const user = result.rows[0];
    const token = generateToken(user.id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 86400000 });
    res.status(201).json({ token, user });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(user.id);

    const { password: _, ...userSafe } = user;
    res.cookie('jwt', token, { httpOnly: true, maxAge: 86400000 });
    res.status(200).json({ token, userSafe });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Change Password
router.post('/change-password', async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Incorrect old password' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE users SET password = $1, "updatedAt" = $2 WHERE id = $3',
      [hashed, new Date(), userId]
    );

    const token = generateToken(user.id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 86400000 });
    res.status(200).json({ message: 'Password updated successfully', token, user });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

module.exports = router;
