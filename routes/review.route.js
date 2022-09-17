const express = require('express');

const { protect, strictTo } = require('../controllers/auth.controller');
const {
  setTourUserIds,
  getAllReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
} = require('../controllers/review.controller');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route('/')
  .get(getAllReviews)
  .post(strictTo('user'), setTourUserIds, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(strictTo('user', 'admin'), updateReview)
  .delete(strictTo('user', 'admin'), deleteReview);

module.exports = router;
