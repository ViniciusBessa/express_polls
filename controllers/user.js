const asyncWrapper = require('../middlewares/async-wrapper');

const getPaginaCadastro = asyncWrapper(async (req, res) => {
  res.status(200).render('cadastro');
});

const cadastrarUsuario = asyncWrapper(async (req, res) => {
  
});

const getPaginaLogin = asyncWrapper(async (req, res) => {
  res.status(200).render('login');
});

const logarUsuario = asyncWrapper(async (req, res) => {
  
});

module.exports = {
  getPaginaCadastro,
  cadastrarUsuario,
  getPaginaLogin,
  logarUsuario,
};
