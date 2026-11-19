
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (full_name, phone, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, full_name, phone`,
      [name.trim(), phone.trim(), hashedPassword]
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      user: result.rows[0]
    });

  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'Phone number already registered.'
      });
    }

    console.error('Registration error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Registration failed.'
    });
  }
});

export default router;
