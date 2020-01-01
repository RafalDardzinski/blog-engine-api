/**
 * Extends WebApplicationBuilder#build() method with additional steps.
 */
class WebApplicationBuildStrategy {
  /**
   * @param {Function[]} defaultMiddleware Default middleware to
   *  be appied to web app before controllers.
   * @param {ErrorHandlingMiddleware} errorHandlerMiddleware Instance of
   * ErrorHandlingMiddleware class.
   */
  constructor(defaultMiddleware = [], errorHandlingMiddleware) {
    this.defaultMiddleware = defaultMiddleware;
    this.errorHandlingMiddleware = errorHandlingMiddleware;
  }

  /**
   * Applies default middleware to web-application.
   * @param {Function} webApp Top-level server request handler (web application).
   */
  applyDefaultMiddleware(webApp) {
    this.defaultMiddleware.forEach(middleware => webApp.use(middleware));
  }

  /**
   * Applies error-handling middleware to web-application.
   * @param {Function} webApp Top-level server request handler (web application).
   */
  applyErrorHandler(webApp) {
    const { errorHandlingMiddleware } = this;
    const errorHandlingMiddlewareFunction = errorHandlingMiddleware
      .handler.bind(errorHandlingMiddleware);
    webApp.use(errorHandlingMiddlewareFunction);
  }
}

module.exports = WebApplicationBuildStrategy;
/**
 * @typedef {import('../error-handler/error-handling-middleware')} ErrorHandlingMiddleware
 */
