const express = require('express');
const pool = require('../db');
const stripeSecond = require('stripe')(process.env.STRIPE_SECRET_KEY_REDUX);

const router = express.Router();

router.get('/all', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM grocery_store');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching all items:', err);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

router.get('/:categoryName', async (req, res) => {
  const category = req.params.categoryName;
  try {
    const result = await pool.query(
      'SELECT * FROM grocery_store WHERE item_category = $1;',
      [category]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching category:', err);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

router.post('/create-checkout-session', async (req, res) => {
  const data = req.body.itemsList;
  const appUrl = process.env.APP_URL || 'http://localhost:3000';

  try {
    const session = await stripeSecond.checkout.sessions.create({
      line_items: data,
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${appUrl}/success`,
      cancel_url: `${appUrl}/cart`,
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

module.exports = router;
