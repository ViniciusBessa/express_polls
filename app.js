const express = require('express');
require('dotenv').config();
const nunjucks = require('nunjucks');

// Security packages
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

// Session storage
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const db = require('./db/db');
const store = new KnexSessionStore({ knex: db });

const app = express();

// Routers
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const pollsRouter = require('./routes/polls');

const authMiddleware = require('./middlewares/authentication');
const notFound = require('./middlewares/not-found');
const errorHandler = require('./middlewares/error-handler');

// Express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/css', express.static('./public/css'));
app.use('/script', express.static('./public/script'));
app.use('/images', express.static('./public/images'));

// Security settings
app.set('trust_proxy', 1);
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 100,
  })
);
app.use(helmet());
app.use(xss());

// Template engine configuration
nunjucks.configure('views', {
  autoescape: true,
  watch: true,
  express: app,
});

app.set('view engine', 'njk');

// Session configuration
const fifteenDays = 1000 * 60 * 60 * 24 * 15;
const sess = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: fifteenDays },
  store,
};

if (process.env.ENVIRONMENT === 'production') {
  sess.proxy = true;
  sess.cookie.secure = true;
  sess.cookie.sameSite = 'none';
}

app.use(session(sess));
app.use(authMiddleware);

// Routes
app.use('/', indexRouter);
app.use('/account', userRouter);
app.use('/polls', pollsRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
