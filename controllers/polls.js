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
  const userIsOwner =
    user.id === Number(poll.id_user) && (user.lastPollID === Number(poll.id) || user.username !== 'Anonymous');
  const choices = await db('poll_choices').where({ id_poll: id }).orderBy('id');
  let totalVotes = 0;
  choices.forEach((choice) => (totalVotes += choice.number_of_votes));
  res.status(200).render('polls/poll', { req, choices, poll, pollIsActive, userIsOwner, totalVotes });
});

const createPoll = asyncWrapper(async (req, res) => {
  const { session, user } = req;
  let { title, choices } = req.body;
  choices = Object.values(choices);
  title = title.trim();
  choices = choices.filter((choice) => choice.trim().length > 0);

  if (!title || title.length === 0 || choices.length <= 1) {
    const message = new Message('Preencha o título da votação e coloque no mínimo duas opções', 'error');
    return res.status(400).json({ success: false, message });
  } else if (title.length > 60) {
    const message = new Message('O título só pode ter até 60 caracteres', 'error');
    return res.status(400).json({ success: false, message });
  }
  const [poll] = await db('polls').insert({ title, id_user: user.id }).returning('id');
  session.lastPollID = poll.id;
  choices.forEach(async (choice) => {
    await db('poll_choices').insert({ id_poll: poll.id, description: choice });
  });
  res.status(201).json({ success: true, pollID: poll.id });
});

const endPoll = asyncWrapper(async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  const [poll] = await db('polls').where({ id });
  const userIsOwner =
    user.id === Number(poll.id_user) && (user.lastPollID === Number(poll.id) || user.username !== 'Anonymous');

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

const searchPolls = asyncWrapper(async (req, res) => {
  let { title } = req.query;
  title = title.trim();

  // Caso o título digitado pelo usuário esteja vazio
  if (!title) {
    return res.status(400).redirect('/');
  }
  const polls = await db('polls')
    .innerJoin('users', 'polls.id_user', 'users.id')
    .whereILike('title', `%${title}%`)
    .select('polls.*', 'users.username');
  res.status(200).render('polls/busca', { req, polls, title });
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
  createPoll,
  endPoll,
  searchPolls,
  getChoices,
  updateChoice,
};
