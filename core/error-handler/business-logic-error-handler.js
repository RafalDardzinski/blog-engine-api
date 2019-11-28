const ErrorHandler = require('./error-handler');
const BusinessLogicError = require('../error/business-logic/base');
const Response = require('./response');
const ENVIRONMENT_TYPES = require('../generics/environment-types');

/**
 * Handles business logic errors.
 * @implements {ErrorHandler}
 */
class BusinessLogicErrorHandler extends ErrorHandler {
  constructor(logger) {
    super();
    this.logger = logger;
  }

  canHandle(error) {
    return error instanceof BusinessLogicError;
  }

  /**
   * @param {BusinessLogicError} error Instance of business logic error.
   */
  handle(error) {
    const env = process.env.NODE_ENV;
    if (env !== ENVIRONMENT_TYPES.TEST) {
      this.logger.error(error.message);
    }

    if (env === ENVIRONMENT_TYPES.DEVELOPMENT) {
      this.logger.error(error.stack);
    }

    return new Response(error.correspondingHttpCode, error.message, error);
  }
}

module.exports = BusinessLogicErrorHandler;
/**
 * @typedef {import('./response')} Response
 */
