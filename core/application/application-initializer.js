/**
 * Bootstraps logic that initializes high-level parts of application.
 */
class ApplicationInitializer {
  /**
   * @param {Object} databaseConnectionManagerFactory Instance of DatabaseConnectionManagerFactory.
   * @param {Object} applicationFactory Instance of ApplicationFactory.
   * @param {Object} serverFactory Instance of ServerFactory.
   */
  constructor(databaseConnectionManagerFactory, applicationFactory, serverFactory) {
    this.databaseConnectionManagerFactory = databaseConnectionManagerFactory;
    this.applicationFactory = applicationFactory;
    this.serverFactory = serverFactory;
  }

  /**
   * Initializes application and starts it.
   * @param {Object<string, ApplicationModule>} modules Modules to include in application.
   * @param {String} databaseConfigPrefix Prefix used to identify db configuration variables.
   */
  initialize(modules, databaseConfigPrefix) {
    const databaseConnectionManager = this.databaseConnectionManagerFactory
      .create(databaseConfigPrefix);
    const application = this.applicationFactory.create(modules, databaseConnectionManager);
    const server = this.serverFactory.create();
    return application.run(server);
  }
}

module.exports = ApplicationInitializer;
/**
 * @typedef {import('./application-module')} ApplicationModule
 */
