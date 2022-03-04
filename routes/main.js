const express = require('express');
const router = express.Router();

const { getHome, createPoll } = require('../controllers/main');

router.route('/').get(getHome).post(createPoll);

module.exports = router;
