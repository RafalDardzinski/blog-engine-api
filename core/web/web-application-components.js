const Controller = require('./controller');
const { InvalidOperationError } = require('../error');

/**
 * Represents web application components.
 */
class WebApplicationComponents {
  /**
   * @typedef {import('./controller')} Controller
   *
   * @param {Controller[]} controllers Application controllers.
   * @param {Function} errorHandler Error handling middleware.
   */
  constructor(controllers, errorHandler) {
    this.controllers = controllers;
    this.errorHandler = errorHandler;
  }

  /**
   * Check if WebApplicationComponents instance contains valid properties.
   */
  validateSelf() {
    const { controllers, errorHandler } = this;
    const areControllersValid = Array.isArray(controllers) && controllers
      .every(c => c instanceof Controller);
    const isErrorHandlerValid = typeof errorHandler === 'function' || errorHandler === undefined;
    if (!areControllersValid) {
      throw new InvalidOperationError('controllers must be an array of instances of Controller class.');
    }
    if (!isErrorHandlerValid) {
      throw new InvalidOperationError('If defined, errorHandler must be a function');
    }
  }
}

module.exports = WebApplicationComponents;
