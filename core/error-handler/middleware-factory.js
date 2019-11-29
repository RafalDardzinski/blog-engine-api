const Joi = require('@hapi/joi');

const { ENVIRONMENT_TYPES } = require('../generics');

/**
 * Creates error handler middleware functions.
 */
class ErrorHandlerMiddlewareFactory {
  /**
   * Creates middleware function.
   * @param {ErrorHandlerRouter} errorHandlerRouter Instance of ErrorHandlerRouter.
   * @param {Logger} logger Instance of logger.
   * @returns {Function} Middleware function.
   */
  static create(errorHandlerRouter, logger) {
    /* eslint-disable-next-line */
    return (error, req, res, next) => {
      const { httpCode, message } = errorHandlerRouter.handleError(error);
      Joi.assert(httpCode, Joi.number().min(100).max(511), `${httpCode} is not a valid http reponse code.`);
      Joi.assert(message, Joi.string(), 'Error message must be a string.');

      const env = process.env.NODE_ENV;
      if (env !== ENVIRONMENT_TYPES.TEST) {
        logger.error(error.message);
      }

      if (env === ENVIRONMENT_TYPES.DEVELOPMENT) {
        logger.error(error.stack);
      }

      return res.status(httpCode).json({ message });
    };
  }
}

module.exports = ErrorHandlerMiddlewareFactory;
/**
 * @typedef {import('./error-handler-router')} ErrorHandlerRouter
 * @typedef {import('../logger/logger')} Logger
 */
