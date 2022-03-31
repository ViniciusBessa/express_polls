const { StatusCodes } = require('http-status-codes');

// Middleware que verifica se o usuário não está autenticado
const loginRequired = (req, res, next) => {
  if (!req.user.isAuthenticated) {
    return res.status(StatusCodes.UNAUTHORIZED).redirect('/');
  }
  next();
};

module.exports = loginRequired;
