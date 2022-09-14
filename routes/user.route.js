const express = require('express');

const { getAllUsers } = require('../controllers/user.controller');
const {
  signup,
  login,
  protect,
  strictTo,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth.controller');

const router = express.Router();

router.use('/signup', signup);
router.use('/login', login);

router.use('/forgot-password', forgotPassword);
router.use('/reset-password', resetPassword);

router.route('/').get(protect, strictTo('admin'), getAllUsers);

module.exports = router;
