const _originalError = new WeakMap();

/**
 * Holds data for responding to the error.
 */
class Response {
  /**
   * @param {Number} httpCode Http response code to respond to error with.
   * @param {String} message Message to respond to error with.
   * @param {Error} originalError Instance of original error that was passed to error handler.
   */
  constructor(httpCode, message, originalError) {
    this.httpCode = httpCode;
    this.message = message;
    _originalError.set(this, originalError);
  }

  /**
   * @returns {String} Stack trace of original error that was passed to error handler.
   */
  get stackTrace() {
    const originalError = _originalError.get(this);
    return originalError.stack;
  }

  /**
   * @returns {String} Message of original error that was passed to error handler.
   */
  get originalMessage() {
    const originalError = _originalError.get(this);
    return originalError.message;
  }
}

module.exports = Response;
