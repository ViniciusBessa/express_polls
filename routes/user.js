const express = require('express');
const router = express.Router();

const logoutRequired = require('../middlewares/logout-required');
const loginRequired = require('../middlewares/login-required');

const {
  getPaginaCadastro,
  cadastrarUsuario,
  getPaginaLogin,
  logarUsuario,
  deslogarUsuario,
  getUserPolls,
} = require('../controllers/user');

router.route('/cadastro').get(logoutRequired, getPaginaCadastro).post(logoutRequired, cadastrarUsuario);
router.route('/login').get(logoutRequired, getPaginaLogin).post(logoutRequired, logarUsuario);
router.route('/logout').get(deslogarUsuario);
router.route('/polls').get(loginRequired, getUserPolls);

module.exports = router;
