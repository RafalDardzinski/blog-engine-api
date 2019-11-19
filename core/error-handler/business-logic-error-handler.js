const BusinessLogicError = require('../error/business-logic/base');
const Response = require('./response');

/**
 * Handles business logic errors.
 */
class BusinessLogicErrorHandler {
  /**
   * Checks if class can handle provided type of error.
   * @param {Error} error Instance of Error.
   * @returns {Boolean} True if error can be handled.
   */
  static canHandle(error) {
    return error instanceof BusinessLogicError;
  }

  /**
   * Handles passed business logic error.
   * @param {BusinessLogicError} error Instance of business logic error.
   * @returns {Response} Instance of Response class.
   */
  static handle(error) {
    return new Response(error.correspondingHttpCode, error.message, error);
  }
}

module.exports = BusinessLogicErrorHandler;
/**
 * @typedef {import('./response')} Response
 */
