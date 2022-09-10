const express = require('express');
const { getMenu, createMenuItem } = require('../controllers/menu.controller');

const router = express.Router();

router.route('/').get(getMenu).post(createMenuItem);

module.exports = router;
