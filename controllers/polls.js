const asyncWrapper = require('../middlewares/async-wrapper');
const Message = require('../middlewares/message');
const db = require('../db/db');

const getPoll = asyncWrapper(async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;
  const [poll] = await db('polls').where({ id });

  // Repassando o request para a página de erro 404
  if (!poll) {
    return next();
  }
  const pollIsActive = poll.is_active;
  const userIsOwner = user.id === poll.id_user && user.lastPollID === poll.id;
  const choices = await db('poll_choices').where({ id_poll: id }).orderBy('id');
  let totalVotes = 0;
  choices.forEach((choice) => totalVotes += choice.number_of_votes);
  res.status(200).render('poll', { req, choices, poll, pollIsActive, userIsOwner, totalVotes });
});

const updatePollVotes = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { choice: choiceID } = req.body;
  const [choice] = await db('poll_choices')
    .where({ id: choiceID, id_poll: id })
    .update({ number_of_votes: db.raw('number_of_votes + 1') }, ['number_of_votes']);

  if (!choice) {
    const message = new Message('Opção inválida', 'error');
    return res.status(404).json({ success: false, message });
  }
  res.status(200).json({ success: true, choice });
});

const endPoll = asyncWrapper(async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  const [poll] = await db('polls').where({ id });
  const userIsOwner = user.id === poll.id_user && user.lastPollID === poll.id;

  // Caso o usuário não seja o dono da votação
  if (!userIsOwner) {
    res.status(403).json({ success: false });
  }
  await db('polls').where({ poll }).update({ is_active: false });
  res.status(200).json({ success: true });
});

module.exports = {
  getPoll,
  updatePollVotes,
  endPoll,
};
