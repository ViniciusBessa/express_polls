const db = require('../db/db');

const authMiddleware = async (req, res, next) => {
  const { session } = req;

  if (!session.userID) {
    return next()
  }

  const [user] = await db('users').where({ id: session.userID }).select('username', 'email');
  req.user = user;
  req.user.isAuthenticated = true;
  next();
}

module.exports = authMiddleware;
