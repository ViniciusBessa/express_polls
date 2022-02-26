const express = require('express');
require('dotenv').config();
const nunjucks = require('nunjucks');

const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const db = require('./db/db');
const store = new KnexSessionStore({ knex: db });

const app = express();

const userRoute = require('./routes/user');

const notFound = require('./middlewares/not-found');
const errorHandler = require('./middlewares/error-handler');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/css', express.static('./public/css'));
app.use('/script', express.static('./public/script'));

// Template engine configuration
nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

// Session configuration
const sess = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {},
  store,
};

if (process.env.ENVIRONMENT === 'production') {
  sess.cookie.secure = true;
};

app.use(session(sess));

// Routes
app.use('/usuario', userRoute);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
const startServer = async () => {
  app.listen(port, () => console.log(`The server is listening on port ${port}...`));
};

startServer();
