const BusinessLogicError = require('./base');

/**
 * Thrown when authentication fails.
 */
class AuthenticationError extends BusinessLogicError {
  /**
   * @param {String} message Error message.
   */
  constructor(message) {
    super(message, 401);
  }
}

module.exports = AuthenticationError;
