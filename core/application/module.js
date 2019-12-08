const _repository = new WeakMap();
const _service = new WeakMap();
const _controller = new WeakMap();

/**
 * Represents module of an application.
 */
class ApplicationModule {
  /**
   * @param {Repository} repository Instance of concrete repository.
   * @param {Service} service Instance of concrete service.
   * @param {Controller} controller Instance of concrete controller.
   */
  constructor(repository, service, controller) {
    _repository.set(this, repository);
    _service.set(this, service);
    _controller.set(this, controller);
  }

  /**
   * Gets module's service.
   * @readonly
   * @returns {Service} Service.
   */
  get service() {
    return _service.get(this);
  }

  /**
   * Gets module's controller.
   * @readonly
   * @returns {Controller} Controller.
   */
  get controller() {
    return _controller.get(this);
  }

  /**
   * Gets module's repository.
   * @readonly
   * @returns {Repository} Repository.
   */
  get repository() {
    return _repository.get(this);
  }

  /**
   * Initializes module's repository by registering it on database connection.
   * @param {DatabaseConnectionManager} dbConnectionManager Instance of connection manager.
   */
  initializeRepository(dbConnectionManager) {
    _repository.get(this).registerConnection(dbConnectionManager);
  }
}

module.exports = ApplicationModule;
/**
 * @typedef {import('../database/connection-manager')} DatabaseConnectionManager
 * @typedef {import('../database/repository')} Repository
 * @typedef {import('../service')} Service
 * @typedef {import('../web/controller')} Controller
 */
