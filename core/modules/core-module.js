/**
 * Represents application's core module that will always be loaded.
 */
class CoreModule {
  /**
   * @param {Repository} repository Instance of module's repository.
   * @param {Service} service Instance of module's service.
   * @param {Controller} controller Instance of module's controller.
   * @param {Object} permissions Set of permissions related to the module.
   */
  constructor(repository, service, controller, permissions) {
    this.repository = repository;
    this.service = service;
    this.controller = controller;
    this.permissions = permissions;
  }
}

module.exports = CoreModule;
/**
 * @typedef {import('../database/repository')} Repository
 * @typedef {import('../service')} Service
 * @typedef {import('../web/controller')} Controller
 */
