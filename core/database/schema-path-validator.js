
const _validator = new WeakMap();
const _message = new WeakMap();

/**
 * Mongoose path custom validator.
 */
class SchemaPathValidator {
  /**
   * @param {Function} validator Validator function.
   * @param {Function} message Failed validation message callback.
   */
  constructor(validator, message) {
    _validator.set(this, validator);
    _message.set(this, message);
  }

  /**
   * Gets schema path validation config object.
   */
  getValidationConfig() {
    const validator = _validator.get(this);
    const message = _message.get(this);
    return {
      validator,
      message,
    };
  }
}

module.exports = SchemaPathValidator;
