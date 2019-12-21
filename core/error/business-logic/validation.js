const BusinessLogicError = require('./base');

/**
 * Thrown when input provided by the client failed validation.
 */
class ValidationError extends BusinessLogicError {
  /**
   * @param {String} message Error message.
   */
  constructor(message) {
    super(message, 400);
  }
}

module.exports = ValidationError;
