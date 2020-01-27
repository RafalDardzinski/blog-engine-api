const Application = require('./application');

const _coreApplicationModules = new WeakMap();
const _webApplicationBuilder = new WeakMap();
const _permissionsManager = new WeakMap();
const _applicationModulesManager = new WeakMap();

/**
 * Registers application modules within instance of ApplicationModulesManager.
 * @param {ApplicationModulesManager} applicationModulesManager Instance of
 * ApplicationModulesManager.
 * @param {Object<string, ApplicationModule>} applicationModules Object containing application
 * modules.
 */
function _setupModules(applicationModulesManager, applicationModules) {
  Object.entries(applicationModules).forEach(([name, applicationModule]) => {
    applicationModulesManager.registerModule(name, applicationModule);
  });
}

class ApplicationFactory {
  /**
   * @param {Object<string, ApplicationModule>} coreApplicationModules Modules to be
   * registered before application modules.
   * @param {WebApplicationBuilder} webApplicationBuilder Instance of WebApplicationBuilder.
   * @param {PermissionsManager} permissionsManager Instance of PermissionsManager.
   * @param {ApplicationModulesManager} applicationModulesManager Instance of
   * ApplicationModulesManager.
   */
  constructor(
    coreApplicationModules,
    webApplicationBuilder,
    permissionsManager,
    applicationModulesManager,
  ) {
    _coreApplicationModules.set(this, coreApplicationModules);
    _webApplicationBuilder.set(this, webApplicationBuilder);
    _permissionsManager.set(this, permissionsManager);
    _applicationModulesManager.set(this, applicationModulesManager);
  }


  /**
   * Assembles final application.
   * @param {Object<string, ApplicationModule>} applicationModules Object containing application
   * modules.
   * @param {DatabaseConnectionManager} databaseConnectionManager Instance of
   * DatabaseConnectionManager.
   */
  create(applicationModules, databaseConnectionManager) {
    /** @type {ApplicationModulesManager} */
    const applicationModulesManager = _applicationModulesManager.get(this);

    /** @type {Object<string, ApplicationModule>} */
    const coreApplicationModules = _coreApplicationModules.get(this);
    _setupModules(applicationModulesManager, coreApplicationModules);
    _setupModules(applicationModulesManager, applicationModules);
    applicationModulesManager.initializeModules(databaseConnectionManager);

    /** @type {PermissionsManager} */
    const permissionsManager = _permissionsManager.get(this);
    applicationModulesManager.registerPermissions(permissionsManager);
    permissionsManager.lock();

    /** @type {WebApplicationBuilder} */
    const webApplicationBuilder = _webApplicationBuilder.get(this);
    const webApplication = webApplicationBuilder.build(applicationModulesManager);

    return new Application(webApplication, databaseConnectionManager);
  }
}

module.exports = ApplicationFactory;
/**
 * @typedef {import('./application-module')} ApplicationModule
 * @typedef {import('./application-modules-manager')} ApplicationModulesManager
 * @typedef {import('../database/connection-manager')} DatabaseConnectionManager
 * @typedef {import('../web/web-application-builder')} WebApplicationBuilder
 * @typedef {import('../authorization/permissions-manager')} PermissionsManager
 */
