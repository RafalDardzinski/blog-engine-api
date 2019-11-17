const BusinessLogicError = require('./base');

/**
 * Thrown when there is no resource matching provided search criteria.
 */
class NotFoundError extends BusinessLogicError {
  /**
   * @param {String} message Error message.
   */
  constructor(message) {
    super(message, 404);
  }
}

module.exports = NotFoundError;
