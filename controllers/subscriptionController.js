const Subscription = require('../models/subscriptionModel');

// Controller function for creating a new subscription
const createSubscription = async (req, res) => {
  try {
    // Get the subscription data from the request body
    const { package, payment } = req.body;

    // Calculate the subscription end date based on the selected package and payment period
    let end_date;
    if (payment.period === 'monthly') {
      end_date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    } else if (payment.period === 'annual') {
      end_date = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    } else {
      throw new Error('Invalid payment period');
    }

    // Create a new subscription object with the subscription data
    const subscription = new Subscription({
      user: req.user._id,
      package,
      payment: {
        intent_id: payment.intent_id,
        amount: payment.amount,
        currency: payment.currency,
        description: payment.description,
        status: payment.status,
        period: payment.period
      },
      end_date
    });

    // Save the subscription to the database
    await subscription.save();

    // Return a success response with the subscription data
    res.status(200).json({ success: true, subscription });
  } catch (err) {
    // Return an error response if the subscription creation fails
    res.status(500).json({ success: false, error: err.message });
  }
};

// Controller function for getting all subscriptions for the current user
const getSubscriptions = async (req, res) => {
  try {
    // Find all subscriptions for the current user
    const subscriptions = await Subscription.find({ user: req.user._id }).populate('user');

    // Return a success response with the subscription data
    res.status(200).json({ success: true, subscriptions });
  } catch (err) {
    // Return an error response if the subscription retrieval fails
    res.status(500).json({ success: false, error: err.message });
  }
};

// Controller function for cancelling a subscription
const cancelSubscription = async (req, res) => {
  try {
    // Find the subscription to be cancelled
    const subscription = await Subscription.findById(req.params.id);

    if (subscription.user.toString() !== req.user._id.toString()) {
        throw new Error('Unauthorized');
      }
      
      // Update the subscription status to cancelled
      subscription.status = 'cancelled';
      
      // Save the updated subscription to the database
      await subscription.save();
      
      // Return a success response with the updated subscription data
      res.status(200).json({ success: true, subscription });
      } catch (err) {
      // Return an error response if the subscription cancellation fails
      res.status(500).json({ success: false, error: err.message });
      }
      };

      module.exports = {createSubscription, getSubscriptions, cancelSubscription}
