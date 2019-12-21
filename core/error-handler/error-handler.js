/* eslint-disable */
const { MissingImplementationError } = require('../error/core');

/**
 * Base error handler class that defines interface for error handlers.
 * @interface
 */
class ErrorHandler {
  /**
   * Defines if current class can handle provided error.
   * @param {Error} error Instance of Error.
   * @returns {Boolean} True if middleware can handle the type of provided error.
   * @abstract
   */
  canHandle(error) {
    throw new MissingImplementationError();
  }

  /**
   * Handles provided error, returns an instance of Response class.
   * @param {Error} error Instance of Error.
   * @returns {Response}
   * @abstract
   */
  handle(error) {
    throw new MissingImplementationError();
  }
}

module.exports = ErrorHandler;
/**
 * @typedef {import('./response')} Response
 */
