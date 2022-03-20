const asyncWrapper = require('../middlewares/async-wrapper');
const Message = require('../middlewares/message');
const db = require('../db/db');

const getHome = asyncWrapper(async (req, res) => {
  res.status(200).render('index', { req });
});

const createPoll = asyncWrapper(async (req, res) => {
  const { session, user } = req;
  let [title, ...choices] = Object.values(req.body);
  title = title.trim();
  choices = choices.filter((choice) => choice.trim().length > 0);

  if (!title || title.length === 0 || choices.length <= 1) {
    const message = new Message('Preencha o título da votação e coloque no mínimo duas opções', 'error');
    return res.status(400).render('index', { req, message });
  } else if (title.length > 60) {
    const message = new Message('O título só pode ter até 60 caracteres', 'error');
    return res.status(400).render('index', { req, message });
  }
  const [poll] = await db('polls').insert({ title, id_user: user.id }).returning('id');
  session.lastPollID = poll.id;
  choices.forEach(async (choice) => {
    await db('poll_choices').insert({ id_poll: poll.id, description: choice });
  });
  res.status(201).redirect(`/polls/${poll.id}`);
});

module.exports = {
  getHome,
  createPoll,
};
