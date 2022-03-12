const express = require('express');
const router = express.Router();

const { getPoll, updateChoice, getChoices, endPoll } = require('../controllers/polls');

router.route('/:id').get(getPoll).patch(endPoll);
router.route('/:id/choices').get(getChoices);
router.route('/:pollID/choices/:choiceID').patch(updateChoice)

module.exports = router;
