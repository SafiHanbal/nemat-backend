const catchAsync = require('../utils/catch-async');
const AppError = require('../utils/app-error');
const APIFeatures = require('../utils/api-features');
const Menu = require('../models/menu.model');

exports.getMenu = catchAsync(async (req, res, next) => {
  const menu = await new APIFeatures(Menu.find(), req.query)
    .filter()
    .sort()
    .limit()
    .paginate().query;

  res.status(200).json({
    status: 'success',
    results: menu.length,
    data: {
      menu,
    },
  });
});

exports.createMenuItem = catchAsync(async (req, res, next) => {
  const menuItem = await Menu.create(req.body);

  if (!menuItem) return next(new AppError('Unable to create menu item!', 400));

  res.status(201).json({
    status: 'success',
    data: {
      menuItem,
    },
  });
});

exports.getMenuItem = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const menuItem = await Menu.findOne({ slug }).populate('reviews');

  if (!menuItem) return next(new AppError('Unabale to find menu item', 404));

  res.status(200).json({
    status: 'success',
    data: {
      menuItem,
    },
  });
});

exports.updateMenuItem = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const menuItem = await Menu.findOneAndUpdate({ slug }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      menuItem,
    },
  });
});

exports.deleteMenuItem = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  await Menu.findOneAndRemove({ slug });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getSpecialDeals = catchAsync(async (req, res, next) => {
  const menuItems = await Menu.aggregate([
    {
      $match: {
        isSpecial: true,
      },
    },
  ]);

  if (!menuItems) return next(new AppError('Special deals not found', 404));

  res.status(200).json({
    status: 'success',
    results: menuItems.length,
    data: {
      menuItems,
    },
  });
});
