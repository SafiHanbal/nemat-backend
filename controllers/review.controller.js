const catchAsync = require('../utils/catch-async');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Review route is working!',
  });
});
