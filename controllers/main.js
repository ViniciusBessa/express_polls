const asyncWrapper = require('../middlewares/async-wrapper');

const getHome = asyncWrapper(async (req, res) => {
  res.status(200).render('index');
});

module.exports = {
  getHome,
};
