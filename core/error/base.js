/**
 * Base error type.
 * @abstract
 */
class EngineError extends Error {
  /**
   * Base custom error class.
   * @param {String} message Error message.
   * @param {(Number)} httpCode Http code corresponding to this type of error.
   */
  constructor(message, httpCode) {
    super(message);
    this.httpCode = httpCode;
  }
}

module.exports = EngineError;
