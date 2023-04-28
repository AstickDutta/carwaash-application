const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Subscription = require('../models/subscriptionModel');
const User = require('../models/userModel');

// Create a new checkout session
const createCheckoutSession = async (req, res) => {
  try {
    // Get the user's subscription
    const subscription = await Subscription.findOne({ user: req.user._id }).populate('package');

    // Create a new checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      subscription_data: {
        items: [
          {
            plan: subscription.package.stripe_plan_id,
          },
        ],
      },
      customer_email: req.user.email,
      success_url: `${process.env.BASE_URL}/checkout/success`,
      cancel_url: `${process.env.BASE_URL}/checkout/cancel`,
    });

    // Return the session ID to the client
    res.json({ sessionId: session.id });
  } catch (err) {
    // Return an error response if there was an error creating the session
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Handle checkout success webhook
const handleCheckoutSuccess = async (req, res) => {
  try {
    const { subscription } = await stripe.checkout.sessions.retrieve(req.body.data.object.id);
    const user = await User.findOne({ email: subscription.customer_email });

    // Create a new subscription for the user
    await Subscription.create({
      user: user._id,
      package: subscription.items.data[0].plan.metadata.packageId,
      stripe_subscription_id: subscription.id,
    });

    // Return a success response
    res.status(200).json({ success: true });
  } catch (err) {
    // Return an error response if there was an error handling the success webhook
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Handle checkout cancel webhook
const handleCheckoutCancel = (req, res) => {
  // Return a cancel response
  res.status(200).json({ success: true });
};

module.exports = {
  createCheckoutSession,
  handleCheckoutSuccess,
  handleCheckoutCancel,
};
