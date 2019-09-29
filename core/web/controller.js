const Route = require('./route');
const { InvalidOperationError } = require('../error');

/**
 * Base controller class.
 * @abstract
 */
class Controller {
  /**
   * @typedef {import('./route')} Route
   *
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
