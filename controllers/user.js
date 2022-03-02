const asyncWrapper = require('../middlewares/async-wrapper');
const Message = require('../middlewares/message');
const db = require('../db/db');
const crypto = require('crypto');

const getPaginaCadastro = asyncWrapper(async (req, res) => {
  // Verificando se o usuário já está autenticado, se sim, ele é redirecionado à home
  if (req.user.isAuthenticated) {
    return res.status(400).redirect('/');
  }
  res.status(200).render('cadastro');
});

const cadastrarUsuario = asyncWrapper(async (req, res) => {
  const { username, password, email } = req.body;
  const { session } = req;

  // Verificando se o usuário já está autenticado, se sim, ele é redirecionado à home
  if (req.user.isAuthenticated) {
    return res.status(400).redirect('/');
  }
  if (!username || !password || !email || username.length === 0 || password.length === 0 || email.length === 0) {
    const message = new Message('Preencha todos os campos', 'error');
    return res.status(400).render('cadastro', { message });
  }
  const [userExist] = await db('users').where({ username }).select('username');

  // Verificando se esse nome de usuário já está em uso
  if (userExist) {
    const message = new Message(`O nome ${userExist.username} já está em uso`, 'error');
    return res.status(400).render('cadastro', { message });
  }
  const salt = crypto.randomBytes(16).toString('hex');
  let hashedPassword = crypto.scryptSync(password, salt, 64).toString('hex');
  hashedPassword = `${hashedPassword}:${salt}`;
  const [userData] = await db('users').insert({ username, password: hashedPassword, email }).returning('id');
  session.userID = userData.id;
  res.status(201).redirect('/');
});

const getPaginaLogin = asyncWrapper(async (req, res) => {
  // Verificando se o usuário já está autenticado, se sim, ele é redirecionado à home
  if (req.user.isAuthenticated) {
    return res.status(400).redirect('/');
  }
  res.status(200).render('login');
});

const logarUsuario = asyncWrapper(async (req, res) => {
  const { username, password } = req.body;
  const { session } = req;

  // Verificando se o usuário já está autenticado, se sim, ele é redirecionado à home
  if (req.user.isAuthenticated) {
    return res.status(400).redirect('/');
  }
  if (!username || !password || username.length === 0 || password.length === 0) {
    const message = new Message('Preencha todos os campos', 'error');
    return res.status(400).render('login', { message });
  }
  let [userData] = await db('users').where({ username }).select('id', 'password');

  if (!userData) {
    const message = new Message('Usuário não encontrado', 'error');
    return res.status(400).render('login', { message });
  }
  const [userKey, salt] = userData.password.split(':');
  const hashedBuffer = crypto.scryptSync(password, salt, 64);
  const hashedKey = Buffer.from(userKey, 'hex');
  const passwordMatch = crypto.timingSafeEqual(hashedBuffer, hashedKey);

  // Verificando se a senha digitada pelo usuário é a mesma que está no banco de dados
  if (!passwordMatch) {
    const message = new Message('Senha inserida está incorreta', 'error');
    return res.status(400).render('login', { message });
  }
  session.userID = userData.id;
  res.status(200).redirect('/');
});

module.exports = {
  getPaginaCadastro,
  cadastrarUsuario,
  getPaginaLogin,
  logarUsuario,
};
