const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  package: {
    type: String,
    enum: ['basic', 'premium', 'deluxe'],
    required: true
  },
  payment: {
    intent_id: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['succeeded', 'pending', 'failed'],
      required: true
    },
    period:{
        type: String,
        enum: ['monthly', "annual"]
    }
  },
  status: {
    type: String,
    enum: ['active', 'cancelled'],
    default: 'active'
  },
  start_date: {
    type: Date,
    default: Date.now
  },
  end_date: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
