const asyncWrapper = require('../middlewares/async-wrapper');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const knex = require('../db/db');
const { randomBytes, scryptSync, timingSafeEqual } = require('crypto');

const getRegisterPage = asyncWrapper(async (req, res) => {
  res.status(StatusCodes.OK).render('user/register');
});

const registerUser = asyncWrapper(async (req, res) => {
  let { username, password, email } = req.body;
  const { session } = req;
  username = username.trim();
  password = password.trim();
  email = email.trim();

  if (!username || !password || !email || username.length === 0 || password.length === 0 || email.length === 0) {
    throw new BadRequestError('Preencha todos os campos');
  } else if (username.length > 30) {
    throw new BadRequestError('O nome de usuário só pode ter até 30 caracteres');
  }
  // Buscando por usuários que já possuam o mesmo nome ou e-mail
  const [userExist] = await knex('users').whereILike('username', `%${username}%`).select('username');
  const [emailInUse] = await knex('users').where({ email }).select('email');

  // Verificando se o nome de usuário ou o e-mail já estão em uso
  if (userExist) {
    throw new BadRequestError(`O nome ${userExist.username} já está em uso`);
  } else if (emailInUse) {
    throw new BadRequestError(`O e-mail ${emailInUse.email} já está em uso`);
  }
  // Criptografando a senha do usuário e o registrando no banco de dados
  const salt = randomBytes(16).toString('hex');
  let hashedPassword = scryptSync(password, salt, 64).toString('hex');
  const [user] = await knex('users')
    .insert({ username, password: hashedPassword, email, salt })
    .returning(['id', 'username']);
  session.userID = user.id;
  res.status(StatusCodes.CREATED).json({ success: true, user });
});

const getLoginPage = asyncWrapper(async (req, res) => {
  res.status(StatusCodes.OK).render('user/login');
});

const loginUser = asyncWrapper(async (req, res) => {
  let { username, password } = req.body;
  const { session } = req;
  username = username.trim();
  password = password.trim();

  if (!username || !password || username.length === 0 || password.length === 0) {
    throw new BadRequestError('Preencha todos os campos');
  }
  let [user] = await knex('users').whereILike('username', `%${username}%`);

  if (!user) {
    throw new NotFoundError(`Usuário com o nome ${username} não foi encontrado`);
  }
  // Retirando a senha criptografada e o salt utilizado
  const { password: userKey, salt } = user;
  const hashedBuffer = scryptSync(password, salt, 64);
  const hashedKey = Buffer.from(userKey, 'hex');
  const passwordMatch = timingSafeEqual(hashedBuffer, hashedKey);

  // Verificando se a senha digitada pelo usuário é a mesma que está no banco de dados
  if (!passwordMatch) {
    throw new BadRequestError('Senha inserida está incorreta');
  }
  session.userID = user.id;
  res.status(StatusCodes.OK).json({ success: true, user: { id: user.id, username: user.username } });
});

const logoutUser = asyncWrapper(async (req, res) => {
  req.session.destroy();
  res.status(StatusCodes.OK).redirect('/');
});

const getUserPolls = asyncWrapper(async (req, res) => {
  const { user } = req;
  const polls = await knex('polls').where({ id_user: user.id });
  res.status(StatusCodes.OK).render('user/userPolls', { req, polls });
});

module.exports = {
  getRegisterPage,
  registerUser,
  getLoginPage,
  loginUser,
  logoutUser,
  getUserPolls,
};
