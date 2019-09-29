/**
 * Extends WEbApplicationBuilder#build() method with additional steps.
 */
class WebApplicationBuildStrategy {
  /**
   * @param {Function[]} defaultMiddleware Default middleware to
   *  be appied to web app before controllers.
   */
  constructor(defaultMiddleware = []) {
    this.defaultMiddleware = defaultMiddleware;
  }

  /**
   * Applies default middleware to web-application.
   * @param {Function} webApp Top-level server request handler (web application).
   */
  applyDefaultMiddleware(webApp) {
    this.defaultMiddleware.forEach(middleware => webApp.use(middleware));
  }
}

module.exports = WebApplicationBuildStrategy;
