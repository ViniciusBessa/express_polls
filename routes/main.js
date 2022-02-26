const express = require('express');
const router = express.Router();

const { getHome } = require('../controllers/main');

router.route('/').get(getHome);

module.exports = router;
