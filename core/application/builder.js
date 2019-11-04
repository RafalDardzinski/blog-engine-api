const Application = require('./application');

class ApplicationBuilder {
  constructor(webApplicationBuilder) {
    this.webApplicationBuilder = webApplicationBuilder;
  }

  /**
   * Builds final application.
   * @param {ApplicationModulesManager} modulesManager Instance of ApplicationModulesManager.
   * @param {DatabaseConnectionManager} databaseConnectionManager Instance of
   * DatabaseConnectionManager.
   */
  build(modulesManager, databaseConnectionManager) {
    modulesManager.initializeModules(databaseConnectionManager);
    const webApp = this.buildWebApplication(modulesManager);

    return new Application(webApp, databaseConnectionManager);
  }

  /**
   * Creates web application.
   * @param {ApplicationModulesManager} modulesManager Instance of ApplicationModulesManager.
   */
  buildWebApplication(modulesManager) {
    return this.webApplicationBuilder.build(modulesManager);
  }
}

module.exports = ApplicationBuilder;
/**
 * @typedef {import('./modules-manager')} ApplicationModulesManager
 * @typedef {import('../database/connection-manager')} DatabaseConnectionManager
 */
