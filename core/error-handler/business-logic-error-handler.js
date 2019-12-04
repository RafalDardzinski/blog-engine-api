const IErrorHandler = require('./error-handler');
const BusinessLogicError = require('../error/business-logic/base');
const Response = require('./response');

/**
 * Handles business logic errors.
 * @implements {IErrorHandler}
 */
class BusinessLogicErrorHandler extends IErrorHandler {
  /**
   * Informs if provided error can be handled by this class.
   * @param {Error} error Instance of error object.
   * @returns {Boolean} True if error can be handled.
   */
  canHandle(error) {
    return error instanceof BusinessLogicError;
  }

  /**
   * Handles the provided error.
   * @param {BusinessLogicError} error Instance of business logic error.
   */
  handle(error) {
    return new Response(error.correspondingHttpCode, error.message, error);
  }
}

module.exports = BusinessLogicErrorHandler;
/**
 * @typedef {import('./response')} Response
 */
