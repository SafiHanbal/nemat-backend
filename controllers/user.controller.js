const catchAsync = require('../utils/catch-async');
const AppError = require('../utils/app-error');
const User = require('../models/user.model');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});
