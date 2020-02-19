const Route = require('./route');
const { InvalidOperationError } = require('../error/core');

const _registeredRoutes = new WeakMap();

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
    _registeredRoutes.set(this, new Map());
  }

  /**
   * Determines if controller has routes setup.
   * @returns {Boolean} True if controller has routes registered.
   */
  get hasRoutes() {
    return this.registeredRoutes.size > 0;
  }

  /**
   * Gets a map of routes registered within component.
   * @returns {Map<string, Route>} Map of registered routes.
   */
  get registeredRoutes() {
    const routes = _registeredRoutes.get(this);
    return new Map(routes);
  }

  /**
   * Registers handler within controller.
   * @param {HttpMethod} method Http method that will trigger the handler.
   * @param {String} mountPath Path that will trigger the handler.
   * @param {Function} handler Handler function.
   */
  registerRoute(method, mountPath, handler) {
    /** @type {Map<string, Route>} */
    const routes = _registeredRoutes.get(this);
    const handlerName = handler.name;
    const route = new Route(method, mountPath, handler);
    routes.set(handlerName, route);
    route.setContext(this);
    return route;
  }

  /**
   * Checks if Controller contains valid properties.
   * @throws {InvalidOperationError} Controller#routes must be non-empty array.
   */
  validateSelf() {
    if (!this.hasRoutes) {
      throw new InvalidOperationError('Controller does not have any routes set.');
    }
  }
}

module.exports = Controller;
/**
 * @typedef {import('./route')} Route
 * @typedef {import('../error/core/invalid-operation')} InvalidOperationError
 * @typedef {import('../generics/http-methods')} HttpMethod
 */
