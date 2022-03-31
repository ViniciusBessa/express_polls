const express = require('express');
const router = express.Router();

const logoutRequired = require('../middlewares/logout-required');
const loginRequired = require('../middlewares/login-required');

const {
  getRegisterPage,
  registerUser,
  getLoginPage,
  loginUser,
  logoutUser,
  getUserPolls,
} = require('../controllers/user');

router
  .route('/register')
  .get(logoutRequired, getRegisterPage)
  .post(logoutRequired, registerUser);
router
  .route('/login')
  .get(logoutRequired, getLoginPage)
  .post(logoutRequired, loginUser);
router.route('/logout').get(logoutUser);
router.route('/polls').get(loginRequired, getUserPolls);

module.exports = router;
