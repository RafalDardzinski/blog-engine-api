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

    /** @type {Map<string, Route>} */
    this.registeredRoutes = new Map();
  }

  /**
   * Determines if controller has routes setup.
   */
  get hasRoutes() {
    return this.registeredRoutes.size > 0;
  }

  registerRoute(method, mountPath, handler) {
    const handlerName = handler.name;
    const route = new Route(method, mountPath, handler);
    route.setContext(this);
    this.registeredRoutes.set(handlerName, route);
    return route;
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

    const areRoutesValid = Array.from(this.registeredRoutes.values())
      .every(r => r instanceof Route);
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
