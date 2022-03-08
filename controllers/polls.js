const asyncWrapper = require('../middlewares/async-wrapper');
const Message = require('../middlewares/message');
const db = require('../db/db');

const getPoll = asyncWrapper(async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;
  const [poll] = await db('polls').where({ id });

  if (!poll) {
    return next();
  }
  const userIsOwner = user.id === poll.id_user && user.lastPollID === poll.id;
  const choices = await db('poll_choices').where({ id_poll: id }).orderBy('id');
  res.status(200).render('poll', { choices, poll, userIsOwner });
});

const updatePollVotes = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { choice: choiceID } = req.body;
  const [choice] = await db('poll_choices')
    .where({ id: choiceID, id_poll: id })
    .update({ number_of_votes: db.raw('number_of_votes + 1') }, ['number_of_votes']);

  if (!choice) {
    const message = new Message('Opção inválida', 'error');
    return res.status(400).json({ message });
  }
  res.status(201).json({ choice });
});

module.exports = {
  getPoll,
  updatePollVotes,
};
