const BusinessLogicErrorHandler = require('./business-logic-error-handler');
const DatabaseErrorHandler = require('./database-error-handler');
const ErrorHandlerRouter = require('./error-handler-router');
const ErrorHandlingMiddleware = require('./error-handling-middleware');

/**
 * Creates instances of ErrorHandlingMiddleware class.
 */
class ErrorHandlingMiddlewareFactory {
  /**
   * Creates a new instance of ErrorHandlingMiddleware class.
   * @param {Logger} logger Instance of Logger.
   * @returns {ErrorHandlingMiddleware} Instance of ErrorHandlingMiddleware class.
   */
  static create(logger) {
    const errorHandlers = [
      new BusinessLogicErrorHandler(),
      new DatabaseErrorHandler(),
    ];

    const errorHandlerRouter = new ErrorHandlerRouter(errorHandlers);
    return new ErrorHandlingMiddleware(errorHandlerRouter, logger);
  }
}

module.exports = {
  ErrorHandlingMiddlewareFactory,
};
/**
 * @typedef {import('../logger/logger')} Logger
 */
