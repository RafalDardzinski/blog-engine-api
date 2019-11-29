const { ENVIRONMENT_TYPES } = require('../generics');

const _errorHandlerRouter = new WeakMap();
const _logger = new WeakMap();

/**
 * Handles incoming errors from web application.
 */
class ErrorHandlingMiddleware {
  /**
   * @param {ErrorHandlerRouter} errorHandlerRouter Instance of ErrorHandlerRouter.
   * @param {Logger} logger Instance of Logger.
   */
  constructor(errorHandlerRouter, logger) {
    _errorHandlerRouter.set(this, errorHandlerRouter);
    _logger.set(this, logger);
  }

  /* eslint-disable-next-line */
  handler(error, req, res, next) {
    const errorHandlerRouter = _errorHandlerRouter.get(this);
    const { httpCode, message } = errorHandlerRouter.handleError(error);

    const env = process.env.NODE_ENV;
    const logger = _logger.get(this);
    if (env !== ENVIRONMENT_TYPES.TEST) {
      logger.error(error.message);
    }

    if (env === ENVIRONMENT_TYPES.DEVELOPMENT) {
      logger.error(error.stack);
    }

    return res.status(httpCode).json({ message });
  }
}

module.exports = ErrorHandlingMiddleware;
/**
 * @typedef {import('./error-handler-router')} ErrorHandlerRouter
 * @typedef {import('../logger/logger')} Logger
 */
