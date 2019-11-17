const AuthenticationError = require('./authentication');
const AuthorizationError = require('./authorization');
const EntityValidationError = require('./entity-validation');
const NotFoundError = require('./not-found');

module.exports = {
  AuthenticationError,
  AuthorizationError,
  EntityValidationError,
  NotFoundError,
};
