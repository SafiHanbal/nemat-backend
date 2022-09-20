const catchAsync = require('../utils/catch-async');
const AppError = require('../utils/app-error');
const APIFeatures = require('../utils/api-features');
const Order = require('../models/order.model');
const Menu = require('../models/menu.model');

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await new APIFeatures(Order.find(), req.query)
    .filter()
    .sort()
    .limit()
    .paginate().query;

  if (!orders) return next(new AppError('Unable to find orders!', 404));

  res.status(200).json({
    status: 'success',
    data: {
      orders,
    },
  });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  req.body.user = req.user._id;

  // Calculating total Price
  const ids = req.body.menuItems.map((item) => item.id);
  const priceArr = req.body.menuItems.map((item) => item.quantity);
  const menuItems = await Menu.find({ _id: { $in: ids } });
  let totalPrice = 0;
  menuItems.forEach(
    (item, i) => (totalPrice = totalPrice + item.price * priceArr[i])
  );
  req.body.totalPrice = totalPrice;

  const order = await Order.create(req.body);
  if (!order) return next(new AppError('Unable to confirm your order.', 400));

  res.status(201).json({
    status: 'success',
    data: {
      order,
    },
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) {
    return next(new AppError('Unable to find order', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  await Order.findByIdAndRemove(id);

  res.status(204).json({
    status: 'success',
    message: 'Order deleted successfully!',
  });
});
