const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user!'],
  },
  menuItems: [
    {
      menuItem: {
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
  orderStatus: {
    type: String,
    enum: ['ordered', 'cooked', 'dispatched', 'dilivered'],
    default: 'ordered',
  },
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
    default: new Date(),
  },
});

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name address',
  }).populate({
    path: 'menuItems.menuItem',
    select: 'name price image',
  });
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
