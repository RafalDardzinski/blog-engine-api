const IErrorHandler = require('./error-handler');
const BusinessLogicError = require('../error/business-logic/base');
const Response = require('./response');

/**
 * Handles business logic errors.
 * @implements {IErrorHandler}
 */
class BusinessLogicErrorHandler extends IErrorHandler {
  canHandle(error) {
    return error instanceof BusinessLogicError;
  }

  /**
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
