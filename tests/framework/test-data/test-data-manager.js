const { Engine: { InvalidOperationError } } = require('../../../core/error');

const _entitiesInjector = new WeakMap();
const _connection = new WeakMap();

function _cleanupDatabase(connection) {
  return connection.db.dropDatabase();
}

function _checkIfInitialized() {
  if (!this.isInitialized) {
    throw new InvalidOperationError('TestDataManager must be initialized first.');
  }
}

class TestDataManager {
  /**
   * @param {EntitiesInjector} entitiesInjector Instance of entities injector.
   */
  constructor(entitiesInjector) {
    _entitiesInjector.set(this, entitiesInjector);
  }

  get isInitialized() {
    return !!_connection.get(this);
  }

  /**
   * Initializes the manager with provided connection.
   * @param {DatabaseConnection} connection Instance of database connection.
   */
  initialize(connection) {
    if (this.isInitialized) {
      throw new InvalidOperationError('TestDataManager is already initialized.');
    }

    _connection.set(this, connection);
    return _cleanupDatabase(connection);
  }

  /**
   * Inject set of test data to the database.
   * @param {Entity[]} testData Array of test data to inject.
   */
  injectTestData(testData) {
    _checkIfInitialized.call(this);

    /** @type {DatabaseConnection} */
    const connection = _connection.get(this);

    /** @type {EntitiesInjector} */
    const entitiesInjector = _entitiesInjector.get(this);

    return entitiesInjector.inject(testData, connection);
  }

  removeInjectedTestData() {
    _checkIfInitialized.call(this);

    /** @type {EntitiesInjector} */
    const entitiesInjector = _entitiesInjector.get(this);
    return entitiesInjector.cleanup();
  }
}

module.exports = TestDataManager;
/**
 * @typedef {import('./entity')} Entity
 * @typedef {import('./entities-injector')} EntitiesInjector
 * @typedef {import('mongoose').Connection} DatabaseConnection
 */
