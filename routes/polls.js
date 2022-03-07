const express = require('express');
const router = express.Router();

const { getPoll } = require('../controllers/polls');

router.route('/:id').get(getPoll);

module.exports = router;
