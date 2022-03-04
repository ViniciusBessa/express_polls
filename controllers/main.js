const asyncWrapper = require('../middlewares/async-wrapper');
const Message = require('../middlewares/message');
const db = require('../db/db');

const getHome = asyncWrapper(async (req, res) => {
  res.status(200).render('index', { req });
});

const createPoll = asyncWrapper(async (req, res) => {
  const [title, ...choices] = Object.values(req.body);

  if (!title || choices.length === 0) {
    const message = new Message('Preencha o título da votação e coloque suas opções', 'error');
    return res.status(400).render('index', { message });
  }
  const session = req.session;
  const owner = req.user.username;
  const [poll] = await db('polls').insert({ title, owner }).returning('id');
  session.lastPollID = poll.id;
  choices.forEach(async (choice) => {
    await db('poll_choices').insert({ id_poll: poll.id, description: choice });
  });
  res.status(201).redirect('/');
});

module.exports = {
  getHome,
  createPoll,
};
