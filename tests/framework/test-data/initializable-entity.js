const { Engine: { MissingImplementationError } } = require('../../../core/error');
const Entity = require('./entity');

/**
 * Represents entities that need to be initialized before use.
 */
class InitializableEntity extends Entity {
  /**
   * Initializes entity.
   * @abstract
   */
  async initialize() {
    throw new MissingImplementationError();
  }
}

module.exports = InitializableEntity;
