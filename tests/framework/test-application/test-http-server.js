const _applicationComponents = new WeakMap();

/**
 * Imitates HttpServer class for testing purposes.
 */
class TestHttpServer {
  /**
   * @param {ApplicationComponents} applicationComponents Instance of ApplicationComponents class.
   */
  constructor(applicationComponents) {
    _applicationComponents.set(this, applicationComponents);
  }

  /**
   * Simulates start of a http server for testing purposes. Assigns web application to
   * application components.
   * @param {Function} webApp Created web application router.
   */
  start(webApp) {
    /** @type {ApplicationComponents} */
    const applicationComponents = _applicationComponents.get(this);
    applicationComponents.setWebApp(webApp);
  }
}

module.exports = TestHttpServer;
/**
 * @typedef {import('../application-components')} ApplicationComponents
 */
