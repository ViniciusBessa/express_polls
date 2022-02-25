const express = require('express');
require('dotenv').config();
const nunjucks = require('nunjucks');
const session = require('express-session');

const app = express();

// Middlewares
const notFound = require('./middlewares/not-found');
const errorHandler = require('./middlewares/error-handler');

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
};

if (process.env.ENVIRONMENT === 'production') {
  sess.cookie.secure = true;
};

app.use(session(sess));

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
const startServer = async () => {
  app.listen(port, () => console.log(`The server is listening on port ${port}...`));
};

startServer();
