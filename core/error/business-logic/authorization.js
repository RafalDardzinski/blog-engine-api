const BusinessLogicError = require('./base');

/**
 * Thrown when access to the resource is forbidden for the current authentication context.
 */
class AuthorizationError extends BusinessLogicError {
  /**
   * @param {String} message Error message.
   */
  constructor(message) {
    super(message, 403);
  }
}

module.exports = AuthorizationError;
