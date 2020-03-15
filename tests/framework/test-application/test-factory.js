const { Engine: { MissingImplementationError } } = require('../../../core/error');

/**
 * Represents factory that allows extracting parts of produced application into an instance
 * of ApplicationComponents class.
 * @interface
 */
class TestFactory {
  /**
   * Injects instance of ApplicationComponents class into factory.
   * @param {ApplicationComponents} applicationComponents Instance of ApplicationComponents.
   * @abstract
   */
  setApplicationComponents(applicationComponents) { // eslint-disable-line
    throw new MissingImplementationError();
  }
}

module.exports = TestFactory;
/**
 * @typedef {import('../application-components')} ApplicationComponents
 */
