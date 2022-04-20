const express = require('express');
const router = express.Router();

const {
  getPollPage,
  endPoll,
  createPoll,
  searchPollsPage,
  getChoices,
  updateChoice,
} = require('../controllers/polls');

router.route('/').post(createPoll);
router.route('/search').get(searchPollsPage);
router.route('/:pollId').get(getPollPage).patch(endPoll);
router.route('/:pollId/choices').get(getChoices);
router.route('/:pollId/choices/:choiceId').patch(updateChoice);

module.exports = router;
