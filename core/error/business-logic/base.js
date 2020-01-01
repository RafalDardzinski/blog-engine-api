/**
 * Error thrown by components handling application's business logic.
 * @abstract
 */
class BusinessLogicError extends Error {
  /**
   * @param {String} message Error message.
   * @param {Number} correspondingHttpCode Http response code corresponding to this type of error.
   */
  constructor(message, correspondingHttpCode) {
    super(message);
    this.correspondingHttpCode = correspondingHttpCode;
  }
}

module.exports = BusinessLogicError;
