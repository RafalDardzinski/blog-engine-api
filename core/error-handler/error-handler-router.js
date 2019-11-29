const Response = require('./response');

const _errorHandlers = new WeakMap();

/**
 * Handles errors using provided error handlers.
 */
class ErrorHandlerRouter {
  /**
   * @param {ErrorHandler[]} errorHandlers Array of classes implementing ErrorHandler interface.
   */
  constructor(errorHandlers = []) {
    _errorHandlers.set(this, errorHandlers);
  }

  /**
   * Uses one of the error handlers to create a response to the provided error. If no error handler
   * can match provided error, creates a generic response.
   * @param {Error} error Instance of error.
   * @returns {Response} Response to the error.
   */
  handleError(error) {
    /** @type {ErrorHandler} */
    const errorHandler = _errorHandlers.get(this).find(handler => handler.canHandle(error));
    if (errorHandler) {
      return errorHandler.handle(error);
    }

    return new Response(500, 'Unexpected error has occured!', error);
  }
}

module.exports = ErrorHandlerRouter;
/**
 * @typedef {import('./i-error-handler')} ErrorHandler
 */
