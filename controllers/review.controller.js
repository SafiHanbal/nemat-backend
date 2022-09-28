const catchAsync = require('../utils/catch-async');
const AppError = require('../utils/app-error');
const Review = require('../models/review.model');

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.menuItem) req.body.menuItem = req.params.menuItemId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  if (!reviews) return next(new AppError('Reviews not found!', 404));

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const review = await Review.create(req.body);
  console.log(req.body);

  if (!review) return next(new AppError('Failed to create review', 400));

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findById(id);
  if (!review) return next(new AppError('Unabale to find review!', 404));

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!review) return next(new AppError('Unable to update review!', 400));

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await Review.findByIdAndRemove(id);

  res.status(204).json({
    status: 'success',
    message: 'Review deleted successfully!',
  });
});
