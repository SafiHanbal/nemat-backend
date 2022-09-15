const express = require('express');

const {
  getAllUsers,
  getMe,
  updateMe,
  deleteMe,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller');

const {
  signup,
  login,
  protect,
  strictTo,
  forgotPassword,
  resetPassword,
  logout,
  updatePassword,
} = require('../controllers/auth.controller');

const router = express.Router();

router.use('/signup', signup);
router.use('/login', login);
router.use('/logout', logout);

router.use('/forgot-password', forgotPassword);
router.use('/reset-password', resetPassword);
router.use('/update-my-password', protect, updatePassword);

router.use(protect);

router.use('/get-me', getMe);
router.use('/update-me', updateMe, updateUser);
router.use('/delete-me', deleteMe);

router.use(strictTo('admin'));

router.route('/').get(getAllUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
