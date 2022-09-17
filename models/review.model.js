const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: [1, 'Please provide a number more than 1!'],
      max: [5, 'Please provide a number less than 5!'],
      required: [true, 'Please provide a rating!'],
    },
    review: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    menuItem: {
      type: mongoose.Schema.ObjectId,
      ref: 'Menu',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ user: 1, menuItem: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
