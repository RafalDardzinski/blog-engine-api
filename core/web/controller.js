const Route = require('./route');
const { InvalidOperationError } = require('../error/core');

/**
 * Base controller class.
 * @abstract
 */
class Controller {
  /**
   * @param {String} mountPath Base path of the controller.
   */
  constructor(mountPath) {
    this.mountPath = mountPath;
    this.routes = null;
  }

  /**
   * Determines if controller has routes setup.
   */
  get hasRoutes() {
    return Array.isArray(this.routes) && !!this.routes.length;
  }

  /**
   * Sets up endpoints for the controller.
   * @param {Route[]} routes Array of controller endpoints.
   */
  registerRoutes(routes) {
    if (!Array.isArray(routes) || !routes.length) {
      throw new InvalidOperationError('Provided routes argument is not an array or is empty.');
    }
    this.routes = [];
    routes.forEach((r) => {
      r.setContext(this);
      this.routes.push(r);
    });
  }

  /**
   * Checks if Controller contains valid properties.
   * @throws {InvalidOperationError} Controller#routes must be non-empty array.
   * @throws {InvalidOperationError} Controller#routes must only contain instances of Route class.
   */
  validateSelf() {
    if (!this.hasRoutes) {
      throw new InvalidOperationError('Controller does not have any routes set.');
    }

    const areRoutesValid = this.routes.every(r => r instanceof Route);
    if (!areRoutesValid) {
      throw new InvalidOperationError('Controller#routes must contain only instances of Route class.');
    }
  }
}

module.exports = Controller;
/**
 * @typedef {import('./route')} Route
 * @typedef {import('../error/core/invalid-operation')} InvalidOperationError
 */
