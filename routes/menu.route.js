const express = require('express');
const reviewRouter = require('../routes/review.route');
const {
  getMenu,
  createMenuItem,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getSpecialDeals,
} = require('../controllers/menu.controller');

const router = express.Router();

router.use('/:menuItemId/review', reviewRouter);

router.route('/special-deals').get(getSpecialDeals);

router.route('/').get(getMenu).post(createMenuItem);
router
  .route('/:slug')
  .get(getMenuItem)
  .patch(updateMenuItem)
  .delete(deleteMenuItem);

module.exports = router;
