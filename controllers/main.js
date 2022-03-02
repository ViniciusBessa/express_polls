const asyncWrapper = require('../middlewares/async-wrapper');
const Message = require('../middlewares/message');

const getHome = asyncWrapper(async (req, res) => {
  res.status(200).render('index', { req });
});

module.exports = {
  getHome,
};
