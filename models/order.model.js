const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user!'],
  },
  menuItems: [
    {
      id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Menu',
        required: [true, 'Please provide item id!'],
      },
      quantity: {
        type: Number,
        required: [true, 'Please provide quantity!'],
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: [true, 'Unable to get total Price!'],
  },
  paymentMethod: {
    type: String,
    enum: ['cash-on-delivery', 'credit-card'],
    required: [true, 'Please select a payment method!'],
  },
  orderedAt: {
    type: Date,
    default: Date.now(),
  },
});

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name address',
  }).populate({
    path: 'menuItems.id',
    select: 'name price',
  });
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
