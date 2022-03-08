const express = require('express');
const router = express.Router();

const { getPoll, updatePollVotes } = require('../controllers/polls');

router.route('/:id').get(getPoll).patch(updatePollVotes);

module.exports = router;
