const catchAsync = require('../utils/catch-async');

exports.getAllBookings = catchAsync((req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Booking route is working!',
  });
});
