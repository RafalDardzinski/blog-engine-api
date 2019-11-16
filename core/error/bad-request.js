const EngineError = require('./base');

/**
 * Indicates that operation cannot be performed with context provided by the user.
 */
class BadRequest extends EngineError {
  /**
   * @param {string} message Error message.
   */
  constructor(message) {
    super(message, 400);
  }
}

module.exports = BadRequest;
