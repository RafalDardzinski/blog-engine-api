const { ApplicationFactory } = require('../../../core/application');

/**
 * Imitates ApplicationFactory for testing purposes.
 * @implements TestFactory
 */
class TestApplicationFactory extends ApplicationFactory {
  /**
   * Sets application components for later use.
   * @param {ApplicationComponents} applicationComponents Instance of ApplicationComponents.
   */
  setApplicationComponents(applicationComponents) {
    this.applicationComponents = applicationComponents;
  }

  /**
   * Assembles final application using original application factory logic. Sets application name on
   * application components.
   * @param {Object<string, ApplicationModule>} applicationModules Object containing application
   * modules.
   * @param {DatabaseConnectionManager} databaseConnectionManager Instance of
   * DatabaseConnectionManager.
   */
  create(applicationModules, databaseConnectionManager) {
    const application = super.create(applicationModules, databaseConnectionManager);
    this.applicationComponents.setApplicationName(application.name);
    return application;
  }
}

module.exports = TestApplicationFactory;
/**
 * @typedef {import('../application-components')} ApplicationComponents
 * @typedef {import('./test-factory')} TestFactory
 */
