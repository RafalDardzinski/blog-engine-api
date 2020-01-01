const Application = require('./application');

class ApplicationBuilder {
  /**
   * @param {WebApplicationBuilder} webApplicationBuilder Instance of WebApplicationBuilder.
   * @param {PermissionsManager} permissionsManager Instance of PermissionsManager.
   */
  constructor(webApplicationBuilder, permissionsManager) {
    this.webApplicationBuilder = webApplicationBuilder;
    this.permissionsManager = permissionsManager;
  }

  /**
   * Builds final application.
   * @param {ApplicationModulesManager} modulesManager Instance of ApplicationModulesManager.
   * @param {DatabaseConnectionManager} databaseConnectionManager Instance of
   * DatabaseConnectionManager.
   */
  build(modulesManager, databaseConnectionManager) {
    modulesManager.registerPermissions(this.permissionsManager);
    this.permissionsManager.lock();

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
 * @typedef {import('../web/web-application-builder')} WebApplicationBuilder
 * @typedef {import('../authorization/permissions-manager')} PermissionsManager
 */
