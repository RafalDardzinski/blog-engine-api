const _applicationInitializer = new WeakMap();

/**
 * Assebles application for testing purposes.
 */
class TestApplicationAssembler {
  /**
   * @param {ApplicationInitializer} applicationInitializer Instance of ApplicationInitializer.
   */
  constructor(applicationInitializer) {
    _applicationInitializer.set(this, applicationInitializer);
  }

  /**
   * Assembles final test application.
   * @param {Object<string, ApplicationModule>} modules Application modules.
   * @param {ApplicationComponents} applicationComponents Instance of ApplicationComponents.
   */
  assemble(modules, applicationComponents) {
    /** @type {ApplicationInitializer} */
    const applicationInitializer = _applicationInitializer.get(this);

    applicationInitializer.databaseConnectionManagerFactory
      .setApplicationComponents(applicationComponents);
    applicationInitializer.applicationFactory.setApplicationComponents(applicationComponents);
    applicationInitializer.serverFactory.setApplicationComponents(applicationComponents);
    return applicationInitializer.initialize(modules);
  }
}

module.exports = TestApplicationAssembler;
/**
 * @typedef {import('../../../core/application/application-module')} ApplicationModule
 * @typedef {import('../../../core/application/application-initializer')} ApplicationInitializer
 * @typedef {import('../application-components')} ApplicationComponents
 */
