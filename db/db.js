const environment = process.env.ENVIRONMENT || 'development';
const configuration = require('../knexfile')[environment];
const db = require('knex')(configuration);

module.exports = db;
