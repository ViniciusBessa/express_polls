const express = require('express');
const router = express.Router();

const { 
  getPaginaCadastro, 
  cadastrarUsuario, 
  getPaginaLogin, 
  logarUsuario
} = require('../controllers/user');

router.route('/cadastro').get(getPaginaCadastro).post(cadastrarUsuario);
router.route('/login').get(getPaginaLogin).post(logarUsuario);

module.exports = router;
