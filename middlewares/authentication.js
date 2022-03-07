const db = require('../db/db');
const { randomUUID, randomBytes} = require('crypto');

const authMiddleware = async (req, res, next) => {
  const { session } = req;

  if (!session.userID) {
    let [anonymousUser] = await db('users').where({ username: 'Anonymous' }).select('id', 'username');

    // Caso o usuário Anonymous não esteja no banco de dados
    if (!anonymousUser) {
      const username = 'Anonymous';
      const email = randomBytes(15).toString('hex');
      const password = randomUUID();
      const salt = randomBytes(16).toString('hex');
      [anonymousUser] = await db('users').insert({ username, email, password, salt }).returning('id', 'username', 'email');
    }
    req.user = anonymousUser;
    req.user.lastPollID = session.lastPollID;
    req.user.isAuthenticated = false;
    return next();
  }

  const [user] = await db('users').where({ id: session.userID }).select('id', 'username', 'email');
  req.user = user;
  req.user.lastPollID = session.lastPollID;
  req.user.isAuthenticated = true;
  next();
};

module.exports = authMiddleware;
