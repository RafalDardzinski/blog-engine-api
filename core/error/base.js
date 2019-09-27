/**
 * Base error type.
 * @abstract
 */
class EngineError extends Error {
  /**
   * Base custom error class.
   * @param {String} message Error message.
   * @param {(String|Number)} code Internal code for an error.
   */
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

module.exports = EngineError;
