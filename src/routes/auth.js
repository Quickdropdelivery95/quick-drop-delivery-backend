
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { name, phone, password, role } = req.body;

    if (!name || !phone || !password || !role) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    if (!['customer', 'shop', 'rider'].includes(role)) {
      return res.status(400).json({ error: 'Invalid account role.' });
    }

    const existing = await pool.query(
      'SELECT id FROM users WHERE phone = $1',
      [phone]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Phone number already registered.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (full_name, phone, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name, phone, role`,
      [name, phone, passwordHash, role]
    );

    res.status(201).json({
      message: 'Registration successful.',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: 'Phone and password are required.' });
    }

    const result = await pool.query(
      `SELECT id, full_name, phone, password_hash, role, active
       FROM users WHERE phone = $1`,
      [phone]
    );

    const user = result.rows[0];

    if (!user || !user.active ||
        !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid phone number or password.' });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured.');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.full_name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Login failed.' });
  }
});

export default router;
