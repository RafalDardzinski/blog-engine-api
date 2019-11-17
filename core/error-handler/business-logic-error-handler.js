// TODO: Add UT and review documentation.

const BusinessLogicError = require('../error/business-logic/base');
const Response = require('./response');

/**
 * Handles business logic errors.
 */
class BusinessLogicErrorHandler {
  static canHandle(error) {
    return error instanceof BusinessLogicError;
  }

  /**
   * Handles passed business logic error.
   * @param {BusinessLogicError} error Instance of business logic error.
   */
  static handle(error) {
    return new Response(error.correspondingHttpCode, error.message, error);
  }
}

module.exports = BusinessLogicErrorHandler;
