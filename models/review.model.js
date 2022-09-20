const mongoose = require('mongoose');
const Menu = require('./menu.model');

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

reviewSchema.statics.calcAverageRatings = async function (menuItemId) {
  const stats = await this.aggregate([
    {
      $match: { menuItem: menuItemId },
    },
    {
      $group: {
        _id: '$menuItem',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    const menu = await Menu.findByIdAndUpdate(menuItemId, {
      ratingsAverage: stats[0].avgRating.toFixed(1),
      ratingsCount: stats[0].nRating,
    });
  } else {
    await Menu.findByIdAndUpdate({
      ratingsAverage: 4.5,
      ratingsCount: 0,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.menuItem);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  this.r.constructor.calcAverageRatings(this.r.menuItem);
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
