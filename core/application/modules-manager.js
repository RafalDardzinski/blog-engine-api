const { InvalidOperationError } = require('../error/core');

const _modules = new WeakMap();

/**
 * Manages application's modules.
 */
class ApplicationModulesManager {
  /**
   * @param {Object} modules Modules registered with unique keys.
   */
  constructor(modules = {}) {
    _modules.set(this, modules);
  }

  /**
   * Gets array that contains each module's controller.
   * @readonly
   * @returns {Controller[]} Array of controllers.
   */
  get controllers() {
    const modules = Object.values(_modules.get(this));
    return modules.map(m => m.controller);
  }

  /**
   * Gets service of a module registered under provided name.
   * @param {String} name Key the module was registered under.
   * @returns {Object} Service instance.
   * @throws Service registered under provided name must be defined.
   */
  getService(name) {
    const module = _modules.get(this)[name];
    if (!module) {
      throw new InvalidOperationError(`Service ${name} does not exist.`);
    }
    return module.service;
  }

  /**
   * Initializes each module.
   * @param {DatabaseConnectionManager} databaseConnectionManager Instance of
   * DatabaseConnectionManager.
   */
  initializeModules(databaseConnectionManager) {
    const modules = Object.values(_modules.get(this));
    modules.forEach(m => m.initializeRepository(databaseConnectionManager));
  }

  /**
   * Registers each modules permissions in provided PermissionsManager.
   * @param {PermissionsManager} permissionsManager Instance of PermissionsManager.
   */
  registerPermissions(permissionsManager) {
    const modules = Object.values(_modules.get(this));
    modules.forEach((module) => {
      module.permissions.forEach(p => permissionsManager.registerPermission(p));
    });
  }
}

module.exports = ApplicationModulesManager;

/**
 * @typedef {import('../web/controller')} Controller
 * @typedef {import('../database/connection-manager')} DatabaseConnectionManager
 * @typedef {import('../authorization/permissions-manager')} PermissionsManager
 */
