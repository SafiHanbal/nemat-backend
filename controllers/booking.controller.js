const catchAsync = require('../utils/catch-async');

exports.getAllBookings = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Booking route is working!',
  });
});
