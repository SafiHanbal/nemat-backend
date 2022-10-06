const express = require('express');
const { protect, strictTo } = require('../controllers/auth.controller');
const {
  getAllOrders,
  createOrder,
  getOrder,
  deleteOrder,
  getCheckoutSession,
} = require('../controllers/order.controller');

const router = express.Router();

router.use(protect);

router.route('/checkout-session').post(protect, getCheckoutSession);

router.route('/').get(getAllOrders).post(createOrder);

router.route('/:id').get(getOrder).delete(deleteOrder);

module.exports = router;
