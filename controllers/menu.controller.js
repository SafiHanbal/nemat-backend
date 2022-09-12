const catchAsync = require('../utils/catch-async');
const AppError = require('../utils/app-error');
const Menu = require('../models/menu.model');

exports.getMenu = catchAsync(async (req, res, next) => {
  const menu = await Menu.find();
  res.status(200).json({
    status: 'success',
    data: {
      menu,
    },
  });
});

exports.createMenuItem = catchAsync(async (req, res, next) => {
  const menuItem = await Menu.create(req.body);

  if (!menuItem) return next(new AppError('Unable to create menu item!', 404));

  res.status(200).json({
    status: 'success',
    data: {
      menuItem,
    },
  });
});

exports.getMenuItem = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  // console.log(params);
  const menuItem = await Menu.findById(id);
  res.status(200).json({
    status: 'success',
    menuItem,
  });
});
