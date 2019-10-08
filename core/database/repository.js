const _model = new WeakMap();

/**
 * Represents repository class that is a layer between direct access to the model and service.
 * @abstract
 */
class Repository {
  /**
   * @param {Model} model Database model.
   * @param {WeakMap} concreteRepositoryModelProperty Private property of concrete repository
   * that extends the Repository class. Emulates protected property.
   */
  constructor(model, concreteRepositoryModelProperty) {
    _model.set(this, model);
    concreteRepositoryModelProperty.set(this, model);
  }

  /**
   * Registers repositories model to database connection manager.
   * @param {ConnectionManager} connectionManager Instance of database connection manager to
   * register repository's model to.
   */
  registerConnection(connectionManager) {
    _model.get(this).registerSelf(connectionManager);
  }
}

module.exports = Repository;
/**
 * @typedef {import('./model')} Model
 * @typedef {import('./connection-manager')} ConnectionManager
 */
