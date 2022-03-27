const { StatusCodes } = require('http-status-codes');
const APIError = require('./api-error');

class ForbiddenError extends APIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = ForbiddenError;
