const express = require('express');
require('dotenv').config();
const nunjucks = require('nunjucks');

// Session storage
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const db = require('./db/db');
const store = new KnexSessionStore({ knex: db });

const app = express();

const mainRouter = require('./routes/main');
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

// Template engine configuration
nunjucks.configure('views', {
  autoescape: true,
  watch: true,
  express: app,
});

app.set('view engine', 'njk');

// Session configuration
const fiftenDays = 1000 * 60 * 60 * 24 * 15;
const sess = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: fiftenDays },
  store,
};

if (process.env.ENVIRONMENT === 'production') {
  sess.cookie.secure = true;
}

app.use(session(sess));
app.use(authMiddleware);

// Routes
app.use('/', mainRouter);
app.use('/conta', userRouter);
app.use('/polls', pollsRouter);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
const startServer = async () => {
  app.listen(port, () => console.log(`The server is listening on port ${port}...`));
};

startServer();
