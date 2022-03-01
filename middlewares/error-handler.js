const errorHandler = (err, req, res, next) => {
  res.status(500).send('<h1>Ocorreu um erro no servidor, tente novamente mais tarde.</h1>');
};

module.exports = errorHandler;
