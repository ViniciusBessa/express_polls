const notFound = (req, res) => res.status(404).send('<h1>Página Não Encontrada</h1>');

module.exports = notFound;
