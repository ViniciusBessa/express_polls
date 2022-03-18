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
  const userIsOwner = user.id === Number(poll.id_user) && user.lastPollID === Number(poll.id);
  const choices = await db('poll_choices').where({ id_poll: id }).orderBy('id');
  let totalVotes = 0;
  choices.forEach((choice) => (totalVotes += choice.number_of_votes));
  res.status(200).render('poll', { req, choices, poll, pollIsActive, userIsOwner, totalVotes });
});

const endPoll = asyncWrapper(async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  const [poll] = await db('polls').where({ id });
  const userIsOwner = user.id === Number(poll.id_user) && user.lastPollID === Number(poll.id);

  // Caso o usuário não seja o dono da votação
  if (!userIsOwner) {
    const message = new Message('Apenas o dono da votação pode encerrá-la', 'error');
    return res.status(403).json({ success: false, message });
  }
  // Caso a votação não exista ou esteja encerrada
  else if (!poll || !poll.is_active) {
    const message = new Message('Votação não encontrada ou encerrada', 'error');
    return res.status(404).json({ success: false, message });
  }
  await db('polls').where({ id }).update({ is_active: false });
  res.status(200).json({ success: true });
});

const getChoices = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const choices = await db('poll_choices').where({ id_poll: id }).orderBy('id');
  res.status(200).json({ choices });
});

const updateChoice = asyncWrapper(async (req, res) => {
  const { pollID, choiceID } = req.params;
  const [poll] = await db('polls').where({ id: pollID });

  if (!poll || !poll.is_active) {
    const message = new Message('A votação está finalizada', 'error');
    return res.status(400).json({ success: false, message });
  }
  const [choice] = await db('poll_choices')
    .where({ id: choiceID, id_poll: pollID })
    .update({ number_of_votes: db.raw('number_of_votes + 1') }, ['number_of_votes']);

  if (!choice) {
    const message = new Message('Opção inválida', 'error');
    return res.status(404).json({ success: false, message });
  }
  res.status(200).json({ success: true, choice });
});

module.exports = {
  getPoll,
  endPoll,
  getChoices,
  updateChoice,
};
