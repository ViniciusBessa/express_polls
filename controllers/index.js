const asyncWrapper = require('../middlewares/async-wrapper');
const { StatusCodes } = require('http-status-codes');

const getHome = asyncWrapper(async (req, res) => {
  res.status(StatusCodes.OK).render('index', { req });
});

module.exports = {
  getHome,
};
