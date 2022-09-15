const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const catchAsync = require('../utils/catch-async');
const AppError = require('../utils/app-error');
const User = require('../models/user.model');
const sendOTP = require('../utils/send-otp');

const createAndSendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    data: {
      token,
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, phone, address, password, passwordConfirm, photo } =
    req.body;

  const user = await User.create({
    name,
    email,
    role: 'user',
    phone,
    address,
    password,
    passwordConfirm,
    photo,
  });

  if (!user)
    return next(new AppError('Unable to signup. Please try again later!', 400));

  createAndSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { phone, password } = req.body;
  if (!phone || !password)
    return next(new AppError('Please provide phone number and password!', 400));

  const user = await User.findOne({ phone }).select('+password');

  if (!user) return next(new AppError('Unable to find user!', 404));
  if (!(await user.correctPassword(password, user.password)))
    return next(new AppError('Incorrect phone number or password!', 400));

  createAndSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 1000),
    httpOnly: true,
  };

  res.cookie('jwt', 'loggedout', cookieOptions);
  res.status(200).json({
    status: 'success',
    message: 'You are logged out successfully!',
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token)
    return next(
      new AppError('You are not logged in. Please login to countinue.', 401)
    );

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);

  if (!user)
    return next(
      new AppError('User associated to this token does no longer exists.', 401)
    );

  if (user.changedPasswordAfter(decoded.iat))
    return next(
      new AppError('User recently changed password. Please log in again!', 401)
    );

  req.user = user;
  next();
});

exports.strictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError('You are not allowed to access this route!', 400)
      );
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { phone } = req.body;

  const user = await User.findOne({ phone });
  if (!user)
    return next(
      new AppError('User related to this number does not exists!', 400)
    );

  const otp = user.createOTP();
  await user.save({ validateBeforeSave: false });

  try {
    await sendOTP(phone, otp);
  } catch (err) {
    return next(
      new AppError('Unable to send OTP. Please try again later', 500)
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'OTP is sent to your phone number!',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { otp } = req.body;
  const hashedToken = crypto.createHash('sha256').update(otp).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError('Invalid OTP!', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.save();

  createAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm, passwordCurrent } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(passwordCurrent, user.password)))
    return next(new AppError('Your current password does not match', 400));

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  console.log(1);
  await user.save();
  console.log(2);
  createAndSendToken(user, 200, res);
});
