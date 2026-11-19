
import { Router } from 'express';
import { pool } from '../db.js';
import auth from '../middleware/auth.js';

const router = Router();

// Create a delivery order
router.post('/', auth, async (req, res) => {
  try {
    const {
      pickup_location,
      delivery_location,
      recipient_name,
      recipient_phone,
      package_description
    } = req.body;

    if (
      !pickup_location ||
      !delivery_location ||
      !recipient_name ||
      !recipient_phone
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required delivery details.'
      });
    }

    const result = await pool.query(
      `INSERT INTO orders (
        customer_id,
        pickup_location,
        delivery_location,
        recipient_name,
        recipient_phone,
        package_description,
        delivery_fee,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        req.user.id,
        pickup_location.trim(),
        delivery_location.trim(),
        recipient_name.trim(),
        recipient_phone.trim(),
        package_description || null,
        0,
        'pending'
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Delivery order created successfully.',
      order: result.rows[0]
    });

  } catch (error) {
    console.error('Order creation error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Could not create delivery order.'
    });
  }
});

// Get a customer's order
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM orders
       WHERE id = $1 AND customer_id = $2`,
      [req.params.id, req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    return res.json({
      success: true,
      order: result.rows[0]
    });

  } catch (error) {
    console.error('Order lookup error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Could not retrieve order.'
    });
  }
});

export default router;
