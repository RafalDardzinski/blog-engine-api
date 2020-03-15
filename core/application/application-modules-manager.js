const Joi = require('@hapi/joi');

const { Engine: { InvalidOperationError } } = require('../error');
const ApplicationModule = require('./application-module');

const _modules = new WeakMap();

/**
 * Manages application's modules.
 */
class ApplicationModulesManager {
  /**
   * @param {Map<string, ApplicationModule>} modules Modules registered with unique keys.
   */
  constructor() {
    _modules.set(this, new Map());
  }

  /**
   * Gets array that contains each module's controller.
   * @readonly
   * @returns {Controller[]} Array of controllers.
   */
  get controllers() {
    /** @type {Map<string, ApplicationModule>} */
    const modules = _modules.get(this);
    return Array.from(modules.values()).map(m => m.controller);
  }

  /**
   * Initializes each module.
   * @param {DatabaseConnectionManager} databaseConnectionManager Instance of
   * DatabaseConnectionManager.
   */
  initializeModules(databaseConnectionManager) {
    /** @type {Map<string, ApplicationModule>} */
    const modules = _modules.get(this);
    Array.from(modules.values()).forEach(m => m.initializeRepository(databaseConnectionManager));
  }

  /**
   * Registers ApplicationModule within internal storage.
   * @param {String} name Unique name to register a module with.
   * @param {ApplicationModule} applicationModule Instance of ApplicationModule to register.
   * @throws Parameter 'name' must be provided and must be a string.
   * @throws Parameter 'applicationModule' must be an instance of ApplicationModule and
   * must be provided.
   * @throws Name must be different than names other modules were registered with.
   */
  registerModule(name, applicationModule) {
    Joi.assert(name, Joi.string().exist(), 'Parameter \'name\' must be provided and must be a string.');
    Joi.assert(applicationModule, Joi.object().instance(ApplicationModule).exist(),
      'Parameter \'applicationModule\' must be provided and must be an instance of ApplicationModule');

    /** @type {Map<string, ApplicationModule>} */
    const modules = _modules.get(this);
    if (modules.has(name)) {
      throw new InvalidOperationError(`There already is a module registered with name '${name}'.`);
    }

    modules.set(name, applicationModule);
  }

  /**
   * Registers each modules permissions in provided PermissionsManager.
   * @param {PermissionsManager} permissionsManager Instance of PermissionsManager.
   */
  registerPermissions(permissionsManager) {
    /** @type {Map<string, ApplicationModule>} */
    const modules = _modules.get(this);
    Array.from(modules.values()).forEach((module) => {
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
