const asyncWrapper = require('../middlewares/async-wrapper');
const Message = require('../middlewares/message');
const db = require('../db/db');

const getHome = asyncWrapper(async (req, res) => {
  res.status(200).render('index', { req });
});

const createPoll = asyncWrapper(async (req, res) => {
  const [title, ...choices] = Object.values(req.body);
  const poll = await db('polls').insert({ title })
});

module.exports = {
  getHome,
  createPoll,
};
