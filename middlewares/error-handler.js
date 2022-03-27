const { StatusCodes } = require('http-status-codes');
const { APIError } = require('../errors');

const errorHandler = (err, req, res, next) => {
  if (err instanceof APIError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('<h1>Ocorreu um erro no servidor</h1>');
};

module.exports = errorHandler;
