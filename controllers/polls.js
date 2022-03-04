const asyncWrapper = require('../middlewares/async-wrapper');

const getPoll = asyncWrapper(async (req, res) => {
  const { id } = req.params;
});

module.exports = {
  getPoll,
};
