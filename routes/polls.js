const express = require('express');
const router = express.Router();

const { getPoll, endPoll, searchPolls, getChoices, updateChoice } = require('../controllers/polls');

router.route('/busca').get(searchPolls);
router.route('/:id').get(getPoll).patch(endPoll);
router.route('/:id/choices').get(getChoices);
router.route('/:pollID/choices/:choiceID').patch(updateChoice);

module.exports = router;
