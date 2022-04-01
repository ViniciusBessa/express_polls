const express = require('express');
const router = express.Router();

const {
  getPoll,
  endPoll,
  createPoll,
  searchPolls,
  getChoices,
  updateChoice,
} = require('../controllers/polls');

router.route('/').post(createPoll);
router.route('/search').get(searchPolls);
router.route('/:pollId').get(getPoll).patch(endPoll);
router.route('/:pollId/choices').get(getChoices);
router.route('/:pollId/choices/:choiceId').patch(updateChoice);

module.exports = router;
