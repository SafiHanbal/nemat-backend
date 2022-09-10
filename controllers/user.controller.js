const catchAsync = require('../utils/catch-async');

exports.getAllUsers = catchAsync((req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'User route is working!',
  });
});
