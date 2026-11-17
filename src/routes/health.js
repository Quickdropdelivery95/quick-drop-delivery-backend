
import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      ok: true,
      service: 'quick-drop-api',
      database: 'connected'
    });
  } catch (error) {
    console.error('DATABASE CONNECTION ERROR:', error);
    res.status(503).json({
      ok: false,
      service: 'quick-drop-api',
      database: 'unavailable',
      error: error.message
    });
  }
});

export default router;
