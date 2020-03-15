const { Engine: { MissingImplementationError } } = require('../../core/error');

/**
 * Test class for controler-level integration tests.
 * @abstract
 */
class IntegrationTestSuite {
  /**
   * @param {Controller} controller Controller to be tested.
   * @param {Function} method Controller's method to be tested.
   */
  constructor(controller, method) {
    const route = controller.registeredRoutes.get(method.name);
    if (!route) {
      throw new Error(`Method '${method.name}' does not have a corresponding registered route.`);
    }

    this.path = `${controller.mountPath}${route.path}`;
    this.testName = `${route.method.toUpperCase()}: ${this.path}`;
  }

  /**
   * Executes tests.
   * @abstract
   */
  tests() {
    throw new MissingImplementationError();
  }

  /**
   * Executes tests using provided dependencies.
   * @param {TestFramework} framework Instance of TestFramework.
   */
  execute(framework) {
    describe(this.testName, () => {
      this.tests(framework);
    });
  }
}

module.exports = IntegrationTestSuite;
/**
 * @typedef {import('../../core/web/controller')} Controller
 * @typedef {import('./framework')} TestFramework
 */
