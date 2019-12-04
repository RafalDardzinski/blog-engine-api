const Joi = require('@hapi/joi');

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
    Joi.assert(httpCode, Joi.number(), `${httpCode} is not a valid http reponse code.`);
    Joi.assert(message, Joi.string().not().empty(), 'Error message must be a string.');

    this.httpCode = httpCode;
    this.message = message;
    _originalError.set(this, originalError);
  }

  get originalError() {
    return _originalError.get(this);
  }
}

module.exports = Response;
