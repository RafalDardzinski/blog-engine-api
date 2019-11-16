const EngineError = require('./base');

/**
 * Indicates that an operation couldn't find any meaningful resource.
 */
class NotFoundError extends EngineError {
  /**
   * @param {string} message Error message.
   */
  constructor(message) {
    super(message, 404);
  }
}

module.exports = NotFoundError;
