const { Engine: { MissingImplementationError }} = require('../../core/error');

class IntegrationTestSuite {
  constructor(controller, method) {
    const route = controller.registeredRoutes.get(method.name);
    if (!route) {
      throw new Error(`Method '${method.name}' does not have a corresponding registered route.`);
    }

    this.path = `${controller.mountPath}${route.path}`;
    this.testName = `${route.method.toUpperCase()}: ${this.path}`;
  }

  tests() {
    throw new MissingImplementationError();
  }

  execute(utilities) {
    describe(this.testName, () => {
      this.tests(utilities);
    });
  }
}

module.exports = IntegrationTestSuite;
