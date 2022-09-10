const catchAsync = require('../utils/catch-async');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'User route is working!',
  });
});
