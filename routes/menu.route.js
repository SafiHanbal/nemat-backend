const express = require('express');
const {
  getMenu,
  createMenuItem,
  getMenuItem,
} = require('../controllers/menu.controller');

const router = express.Router();

router.route('/').get(getMenu).post(createMenuItem);

router.route('/:id').get(getMenuItem);

module.exports = router;
