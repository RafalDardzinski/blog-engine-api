/**
 * Extends WebApplicationBuilder#build() method with additional steps.
 */
class WebApplicationBuildStrategy {
  /**
   * @param {Function[]} defaultMiddleware Default middleware to
   *  be appied to web app before controllers.
   */
  constructor(defaultMiddleware = [], errorHandlerMiddleware) {
    this.defaultMiddleware = defaultMiddleware;
    this.errorHandlerMiddleware = errorHandlerMiddleware;
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
    webApp.use(this.errorHandlerMiddleware);
  }
}

module.exports = WebApplicationBuildStrategy;
