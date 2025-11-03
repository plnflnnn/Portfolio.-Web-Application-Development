const express = require('express');
const stripe = require('stripe')(process.env.SECRET_STRIPE_KEY);

const router = express.Router();

router.post('/payment-sheet', async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount < 50)
    return res.status(400).json({ error: 'Amount must be at least 50 cents.' });

  try {
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2023-10-16' }
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      customer: customer.id,
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: process.env.PUBLISHABLE_STRIPE_KEY,
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Payment setup failed' });
  }
});

module.exports = router;
