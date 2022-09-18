const express = require('express');
const { protect, strictTo } = require('../controllers/auth.controller');
const {
  getAllOrders,
  createOrder,
  getOrder,
  deleteOrder,
} = require('../controllers/order.controller');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(strictTo('admin', 'staff'), getAllOrders)
  .post(createOrder);

router.route('/:id').get(getOrder).delete(deleteOrder);

module.exports = router;
