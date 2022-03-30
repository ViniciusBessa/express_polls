const knex = require('../db/db');
const { randomUUID, randomBytes} = require('crypto');

const authMiddleware = async (req, res, next) => {
  const { session } = req;

  if (!session.userID) {
    let [anonymousUser] = await knex('users').where({ username: 'Anonymous' }).select('id', 'username', 'email');

    // Caso o usuário Anonymous não esteja no banco de dados
    if (!anonymousUser) {
      const username = 'Anonymous';
      const email = randomBytes(16).toString('hex');
      const password = randomUUID();
      const salt = randomBytes(16).toString('hex');
      [anonymousUser] = await knex('users').insert({ username, email, password, salt }).returning('id', 'username', 'email');
    }
    req.user = anonymousUser;
    req.user.lastPollID = session.lastPollID;
    req.user.isAuthenticated = false;
    return next();
  }
  const [user] = await knex('users').where({ id: session.userID }).select('id', 'username', 'email');
  req.user = user;
  req.user.lastPollID = session.lastPollID;
  req.user.isAuthenticated = true;
  next();
};

module.exports = authMiddleware;
