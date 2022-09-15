const catchAsync = require('../utils/catch-async');
const AppError = require('../utils/app-error');
const User = require('../models/user.model');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  const cookies = req.cookies;

  res.status(200).json({
    status: 'success',
    cookies,
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user)
    return next(new AppError('Unable to find user with this id!', 404));

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError('This route is not for password update.', 400));

  const id = req.params.id || req.user.id;
  const filteredBody = filterObj(
    req.body,
    'name',
    'address',
    'phone',
    'email',
    'photo'
  );

  const user = await User.findByIdAndUpdate(id, filteredBody, {
    new: true,
  });
  if (!user) return next(new AppError('Unable to update user!', 400));

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await User.findByIdAndRemove(id);

  res.status(204).json({
    status: 'success',
    message: 'User deleted successfully!',
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = req.user;

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  req.user.id = req.user._id;
  next();
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = req.user;
  user.active = false;
  await user.save({ validateBeforeSave: false });
  res.status(204).json({
    status: 'success',
    message: 'User deleted successfully!',
  });
});
