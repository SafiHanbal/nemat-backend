const catchAsync = require('../utils/catch-async');

exports.getMenu = catchAsync((req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Menu route is working!',
  });
});
