const asyncWrapper = require('../middlewares/async-wrapper');
const db = require('../db/db');

const getPoll = asyncWrapper(async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  const [poll] = await db('polls').where({ id });
  const userIsOwner = user.id === poll.id_user && user.lastPollID === poll.id;
  const choices = await db('poll_choices').where({ id_poll: id });
  res.status(200).render('poll', { choices, poll, userIsOwner });
});

module.exports = {
  getPoll,
};
