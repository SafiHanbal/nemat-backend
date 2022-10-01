const multer = require('multer');
const sharp = require('sharp');
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

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.updateUserPhoto = upload.single('photo');

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
    return next(new AppError('User associated with this id not found!', 404));

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
  const filteredBody = filterObj(req.body, 'name', 'address', 'phone', 'email');

  if (req.file)
    filteredBody.photo = `http://127.0.0.1:8000/images/user/${req.file.filename}`;

  const user = await User.findByIdAndUpdate(id, filteredBody, {
    new: true,
    // runValidators: true,
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

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 80 })
    .toFile(`public/images/user/${req.file.filename}`);

  next();
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not defined to update password. Instead use /changeMyPassword route.',
        400
      )
    );
  }

  // Parsing stringified address data received from Nested FormData Value
  if (req.body.address) req.body.address = JSON.parse(req.body.address);

  if (req.file) req.user.id = req.user._id;
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
