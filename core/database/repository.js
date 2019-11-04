const _model = new WeakMap();
const _isInitialized = new WeakMap();

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
    _isInitialized.set(this, false);
    concreteRepositoryModelProperty.set(this, model);
  }

  /**
   * Gets information if repository's model is registered on connection.
   * @readonly
   * @returns {boolean} Information if repository is initialized.
   */
  get isInitialized() {
    return _isInitialized.get(this);
  }

  /**
   * Registers repositories model to database connection manager.
   * @param {DatabaseConnectionManager} databaseConnectionManager Instance of
   * DatabaseConnectionManager to register repository's model to.
   */
  registerConnection(databaseConnectionManager) {
    _model.get(this).registerSelf(databaseConnectionManager);
    _isInitialized.set(this, true);
  }
}

module.exports = Repository;
/**
 * @typedef {import('./model')} Model
 * @typedef {import('./connection-manager')} DatabaseConnectionManager
 */
