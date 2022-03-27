const APIError = require('./api-error');
const BadRequestError = require('./bad-request');
const ForbiddenError = require('./forbidden');
const NotFoundError = require('./not-found');
const UnauthenticatedError = require('./unauthenticated');

module.exports = {
  APIError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthenticatedError,
};
