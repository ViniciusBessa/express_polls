// Middleware que verifica se o usuário não está autenticado, o redirecionado à home caso não esteja
const loginRequired = (req, res, next) => {
  if (!req.user.isAuthenticated) {
    return res.status(401).redirect('/');
  }
  next();
}

module.exports = loginRequired;
