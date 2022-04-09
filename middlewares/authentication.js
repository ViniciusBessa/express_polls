const knex = require('../db/db');
const { randomUUID, randomBytes } = require('crypto');

const authMiddleware = async (req, res, next) => {
  const { session } = req;
  // Garantndo que a chave createdPolls não esteja undefined
  session.createdPolls = session.createdPolls || [];

  // Função que retorna o usuário Anonymous
  const getAnonymousUser = async () => {
    let [anonymousUser] = await knex('users')
      .where({ username: 'Anonymous' })
      .select('id', 'username');

    // Caso o usuário Anonymous não esteja no banco de dados
    if (!anonymousUser) {
      const username = 'Anonymous';
      const email = randomBytes(16).toString('hex');
      const password = randomUUID();
      const salt = randomBytes(16).toString('hex');
      [anonymousUser] = await knex('users')
        .insert({ username, email, password, salt })
        .returning('id', 'username');
    }
    anonymousUser;
    anonymousUser.createdPolls = session.createdPolls;
    anonymousUser.isAuthenticated = false;
    return anonymousUser;
  };

  // Se o usuário não tiver os cookies de uma conta registrada
  if (!session.userId) {
    req.user = await getAnonymousUser();
    return next();
  }
  const [user] = await knex('users')
    .where({ id: session.userId })
    .select('id', 'username', 'email');

  // Se os cookies do usuário não corresponderem a nenhuma conta
  if (!user) {
    req.user = await getAnonymousUser();
    return next();
  }
  req.user = user;
  req.user.createdPolls = session.createdPolls;
  req.user.isAuthenticated = true;
  next();
};

module.exports = authMiddleware;
