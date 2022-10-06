const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const catchAsync = require('../utils/catch-async');
const AppError = require('../utils/app-error');
const APIFeatures = require('../utils/api-features');
const Order = require('../models/order.model');
const Menu = require('../models/menu.model');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const ids = req.body.menuItems.map((item) => item.id);
  const quantities = req.body.menuItems.map((item) => item.quantity);
  const menuItems = await Menu.find({ _id: { $in: ids } });

  const lineItemsArr = menuItems.map((item, i) => {
    return {
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
          images: [item.image.small],
        },
        unit_amount: item.price * 100,
      },
      quantity: quantities[i],
    };
  });

  const session = await stripe.checkout.sessions.create({
    line_items: lineItemsArr,
    mode: 'payment',
    client_reference_id: req.user.id,
    success_url: 'http://127.0.0.1:3000',
    cancel_url: 'http://127.0.0.1:3000/menu',
  });

  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await new APIFeatures(Order.find(), req.query)
    .filter()
    .sort()
    .limit()
    .paginate().query;

  if (!orders) return next(new AppError('Orders not found!', 404));

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
  const ids = req.body.menuItems.map((item) => item.menuItem);
  const quantityArr = req.body.menuItems.map((item) => item.quantity);
  const menuItems = await Menu.find({ _id: { $in: ids } });
  console.log(menuItems);
  let totalPrice = 0;
  menuItems.forEach(
    (item, i) => (totalPrice = totalPrice + item.price * quantityArr[i])
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
    return next(new AppError('Order not found', 404));
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
