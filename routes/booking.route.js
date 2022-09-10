const express = require('express');
const { getAllBookings } = require('../controllers/booking.controller');

const router = express.Router();

router.route('/').get(getAllBookings);

module.exports = router;
