
const EngineError = require('./base');

class ValidationError extends EngineError {
  /**
   * Indicates that the value did not pass validation.
   * @param {Error[]} errors Errors returned by validator.
   * @param {String} message ValidationError message.
   * @param {(String|Number)} [code=VALIDATION] Internal code for an error.
   */
  constructor(errors = [], message, code = 'VALIDATION') {
    super(message, code);
    this.errors = errors;
  }
}

module.exports = ValidationError;
