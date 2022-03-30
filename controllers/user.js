const asyncWrapper = require('../middlewares/async-wrapper');
const { StatusCodes } = require('http-status-codes');
const Message = require('../middlewares/message');
const knex = require('../db/db');
const { randomBytes, scryptSync, timingSafeEqual } = require('crypto');

const getPaginaCadastro = asyncWrapper(async (req, res) => {
  res.status(StatusCodes.OK).render('user/cadastro');
});

const cadastrarUsuario = asyncWrapper(async (req, res) => {
  let { username, password, email } = req.body;
  const { session } = req;
  username = username.trim();
  password = password.trim();
  email = email.trim();

  if (!username || !password || !email || username.length === 0 || password.length === 0 || email.length === 0) {
    const message = new Message('Preencha todos os campos', 'error');
    return res.status(StatusCodes.BAD_REQUEST).render('user/cadastro', { message });
  } else if (username.length > 30) {
    const message = new Message('O nome de usuário só pode ter até 30 caracteres');
    return res.status(StatusCodes.BAD_REQUEST).render('user/cadastro', { message });
  }
  // Buscando por usuários que já possuam o mesmo nome ou e-mail
  const [userExist] = await knex('users').whereILike('username', `%${username}%`).select('username');
  const [emailInUse] = await knex('users').where({ email }).select('email');

  // Verificando se o nome de usuário ou o e-mail já estão em uso
  if (userExist) {
    const message = new Message(`O nome ${userExist.username} já está em uso`, 'error');
    return res.status(StatusCodes.BAD_REQUEST).render('user/cadastro', { message });
  } else if (emailInUse) {
    const message = new Message(`O e-mail ${emailInUse.email} já está em uso`, 'error');
    return res.status(StatusCodes.BAD_REQUEST).render('user/cadastro', { message });
  }
  // Criptografando a senha do usuário e o registrando no banco de dados
  const salt = randomBytes(16).toString('hex');
  let hashedPassword = scryptSync(password, salt, 64).toString('hex');
  const [userData] = await knex('users').insert({ username, password: hashedPassword, email, salt }).returning('id');
  session.userID = userData.id;
  res.status(StatusCodes.CREATED).redirect('/');
});

const getPaginaLogin = asyncWrapper(async (req, res) => {
  res.status(StatusCodes.OK).render('user/login');
});

const logarUsuario = asyncWrapper(async (req, res) => {
  let { username, password } = req.body;
  const { session } = req;
  username = username.trim();
  password = password.trim();

  if (!username || !password || username.length === 0 || password.length === 0) {
    const message = new Message('Preencha todos os campos', 'error');
    return res.status(StatusCodes.BAD_REQUEST).render('user/login', { message });
  }
  let [userData] = await knex('users').whereILike('username', `%${username}%`).select('id', 'password', 'salt');

  if (!userData) {
    const message = new Message('Usuário não encontrado', 'error');
    return res.status(StatusCodes.NOT_FOUND).render('user/login', { message });
  }
  // Retirando a senha criptografada e o salt utilizado
  const { password: userKey, salt } = userData;
  const hashedBuffer = scryptSync(password, salt, 64);
  const hashedKey = Buffer.from(userKey, 'hex');
  const passwordMatch = timingSafeEqual(hashedBuffer, hashedKey);

  // Verificando se a senha digitada pelo usuário é a mesma que está no banco de dados
  if (!passwordMatch) {
    const message = new Message('Senha inserida está incorreta', 'error');
    return res.status(StatusCodes.BAD_REQUEST).render('user/login', { message });
  }
  session.userID = userData.id;
  res.status(StatusCodes.OK).redirect('/');
});

const deslogarUsuario = asyncWrapper(async (req, res) => {
  req.session.destroy();
  res.status(StatusCodes.OK).redirect('/');
});

const getUserPolls = asyncWrapper(async (req, res) => {
  const { user } = req;
  const polls = await knex('polls').where({ id_user: user.id });
  res.status(StatusCodes.OK).render('user/userPolls', { req, polls });
});

module.exports = {
  getPaginaCadastro,
  cadastrarUsuario,
  getPaginaLogin,
  logarUsuario,
  deslogarUsuario,
  getUserPolls,
};
