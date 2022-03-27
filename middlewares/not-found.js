const { StatusCodes } = require('http-status-codes');

const notFound = (req, res) => res.status(StatusCodes.NOT_FOUND).send('<h1>Página Não Encontrada</h1>');

module.exports = notFound;
