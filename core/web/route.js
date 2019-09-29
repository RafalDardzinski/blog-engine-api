const { HTTP_METHODS } = require('../generics');
const { InvalidOperationError } = require('../error');

const _handler = new WeakMap();

/**
 * Represents a controller endpoint.
 */
class Route {
  /**
   * @param {HTTP_METHODS} method Http method which will trigger the route handler.
   * @param {String} path Relative path that will trigger the handler.
   * @param {Function} handler Function triggered when path is requested with specified method.
   */
  constructor(method, path, handler) {
    this.method = method;
    this.path = path;
    _handler.set(this, handler);
  }

  /**
   * Function triggered when path is requested with specified method.
   */
  get handler() {
    return async (req, res, next) => {
      try {
        await _handler.get(this)(req, res, next);
      } catch (e) {
        next(e);
      }
    };
  }

  /**
   * Sets context for the handler function.
   * @param {Object} ctx Context for handler to execute.
   */
  setContext(ctx) {
    const handler = _handler.get(this);
    _handler.set(this, handler.bind(ctx));
  }

  /**
   * Checks if Route contains valid properties.
   * @throws {InvalidOperationError} Method must be a supported Http method.
   */
  validateSelf() {
    const hasValidMethod = Object.values(HTTP_METHODS).includes(this.method);
    if (!hasValidMethod) {
      throw new InvalidOperationError(`Method '${this.method}' is not allowed.`);
    }
  }
}

module.exports = Route;
