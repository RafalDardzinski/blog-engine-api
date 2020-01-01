const AuthenticationError = require('./authentication');
const AuthorizationError = require('./authorization');
const ValidationError = require('./validation');
const NotFoundError = require('./not-found');

module.exports = {
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NotFoundError,
};
