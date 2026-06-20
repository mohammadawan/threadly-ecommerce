const router = require('express').Router();
const Order = require('../models/Order');

// Raw body is required for Stripe signature verification.
// This route must be mounted BEFORE express.json() in server.js.
router.post(
  '/stripe',
  require('express').raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Stripe webhook signature failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object;
      await Order.findOneAndUpdate(
        { stripePaymentIntentId: pi.id },
        {
          isPaid: true,
          paidAt: new Date(),
          status: 'processing',
          'paymentResult.id': pi.id,
          'paymentResult.status': pi.status,
          'paymentResult.update_time': new Date().toISOString(),
          'paymentResult.email_address': pi.receipt_email,
        }
      );
    }

    if (event.type === 'payment_intent.payment_failed') {
      const pi = event.data.object;
      console.warn(`Payment failed for intent ${pi.id}`);
    }

    res.json({ received: true });
  }
);

module.exports = router;
