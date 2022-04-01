const asyncWrapper = require('../middlewares/async-wrapper');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, ForbiddenError, NotFoundError } = require('../errors');
const knex = require('../db/db');

const getPoll = asyncWrapper(async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;
  const [poll] = await knex('polls').where({ id });

  // Repassando o request para a página de erro 404
  if (!poll) {
    return next();
  }
  const pollIsActive = poll.is_active;
  const userIsOwner =
    user.id === Number(poll.id_user) &&
    (user.lastPollID === Number(poll.id) || user.username !== 'Anonymous');
  const choices = await knex('poll_choices')
    .where({ id_poll: id })
    .orderBy('id');
  let totalVotes = 0;
  choices.forEach((choice) => (totalVotes += choice.number_of_votes));
  res
    .status(StatusCodes.OK)
    .render('polls/poll', {
      req,
      choices,
      poll,
      pollIsActive,
      userIsOwner,
      totalVotes,
    });
});

const createPoll = asyncWrapper(async (req, res) => {
  const { session, user } = req;
  let { title, choices } = req.body;
  choices = Object.values(choices);
  title = title.trim();
  choices = choices.filter((choice) => choice.trim().length > 0);

  if (!title || title.length === 0 || choices.length <= 1) {
    throw new BadRequestError(
      'Preencha o título da votação e coloque no mínimo duas opções'
    );
  } else if (title.length > 60) {
    throw new BadRequestError('O título só pode ter até 60 caracteres');
  }
  const [poll] = await knex('polls')
    .insert({ title, id_user: user.id })
    .returning('id');
  session.lastPollID = poll.id;
  choices.forEach(async (choice) => {
    await knex('poll_choices').insert({
      id_poll: poll.id,
      description: choice,
    });
  });
  res.status(StatusCodes.CREATED).json({ success: true, pollID: poll.id });
});

const endPoll = asyncWrapper(async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  const [poll] = await knex('polls').where({ id });

  // Caso a votação não tenha sido encontrada
  if (!poll) {
    throw new NotFoundError('Votação não encontrada');
  }
  const userIsOwner =
    user.id === Number(poll.id_user) &&
    (user.lastPollID === Number(poll.id) || user.username !== 'Anonymous');

  // Caso o usuário não seja o dono da votação
  if (!userIsOwner) {
    throw new ForbiddenError('Apenas o dono da votação pode encerrá-la');
  }
  // Caso a votação esteja encerrada
  else if (!poll.is_active) {
    throw new BadRequestError('Essa votação já foi encerrada');
  }
  await knex('polls').where({ id }).update({ is_active: false });
  res.status(StatusCodes.OK).json({ success: true });
});

const searchPolls = asyncWrapper(async (req, res) => {
  let { title } = req.query;
  title = title.trim();

  // Caso o título digitado pelo usuário esteja vazio
  if (!title) {
    return res.status(StatusCodes.BAD_REQUEST).redirect('/');
  }
  const polls = await knex('polls')
    .innerJoin('users', 'polls.id_user', 'users.id')
    .whereILike('title', `%${title}%`)
    .select('polls.*', 'users.username');
  res.status(StatusCodes.OK).render('polls/search', { req, polls, title });
});

const getChoices = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const choices = await knex('poll_choices')
    .where({ id_poll: id })
    .orderBy('id');

  if (choices.length === 0) {
    throw new NotFoundError(
      `Não foram encontradas opções de uma votação com id ${id}`
    );
  }
  res.status(StatusCodes.OK).json({ success: true, choices });
});

const updateChoice = asyncWrapper(async (req, res) => {
  const { pollID, choiceID } = req.params;
  const [poll] = await knex('polls').where({ id: pollID });

  if (!poll || !poll.is_active) {
    throw new BadRequestError('A votação está finalizada');
  }
  const [choice] = await knex('poll_choices')
    .where({ id: choiceID, id_poll: pollID })
    .update({ number_of_votes: knex.raw('number_of_votes + 1') }, [
      'number_of_votes',
    ]);

  if (!choice) {
    throw new NotFoundError('Opção não encontrada');
  }
  res.status(StatusCodes.OK).json({ success: true, choice });
});

module.exports = {
  getPoll,
  createPoll,
  endPoll,
  searchPolls,
  getChoices,
  updateChoice,
};
