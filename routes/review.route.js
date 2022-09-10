const express = require('express');

const { getAllReviews } = require('../controllers/review.controller');

const router = express.Router();

router.route('/').get(getAllReviews);

module.exports = router;
