const TestHttpServer = require('./test-http-server');

const _applicationComponents = new WeakMap();

/**
 * Creates test http server.
 */
class TestHttpServerFactory {
  /**
   * Sets application components for later use.
   * @param {ApplicationComponents} applicationComponents Instance of ApplicationComponents.
   */
  setApplicationComponents(applicationComponents) {
    _applicationComponents.set(this, applicationComponents);
  }

  /**
   * Creates test http server.
   */
  create() {
    const applicationComponents = _applicationComponents.get(this);
    return new TestHttpServer(applicationComponents);
  }
}

module.exports = TestHttpServerFactory;
/**
 * @typedef {import('../application-components')} ApplicationComponents
 */
