// Middleware que verifica se o usuário já está autenticado, se sim, ele é redirecionado à home
const logoutRequired = (req, res, next) => {
  if (req.user.isAuthenticated) {
    return res.status(403).redirect('/');
  }
  next();
};

module.exports = logoutRequired;
