const { InvalidOperationError } = require('../error/core');

const Model = require('./model');
const defaultOptions = require('./default-connection-options');

const _config = new WeakMap();
const _connection = new WeakMap();

/*
  TODO: For now, this is only single-db implementation, needs replica sets and transactions
  for production. To be added in the future.
*/

/**
 * Manages connection with a database.
 */
class DatabaseConnectionManager {
  /**
   * @param {Function} connectionFactoryMethod Connection factory method.
   * @param {DatabaseConfiguration} config Instance of dabase configuration.
   * @param {Object} connectionObserver Contains hooks to changes in connection.
   */
  constructor(connectionFactoryMethod, config, connectionObserver) {
    _config.set(this, config);

    const connection = connectionFactoryMethod();
    if (connectionObserver) {
      connectionObserver.watch(connection);
    }
    _connection.set(this, connection);
  }

  /**
   * Informs if connection has been established.
   */
  get isConnected() {
    return _connection.get(this).readyState === 1;
  }

  /**
   * Connects to the database.
   * @param {Object=} options Connection options. Can overwrite default options.
   */
  connect(options = {}) {
    const connection = _connection.get(this);
    const config = _config.get(this);
    const opts = Object.assign({}, defaultOptions, options);
    return connection.openUri(config.getUri(), opts);
  }

  /**
   * Closes the connection to the database.
   */
  disconnect() {
    return _connection.get(this).close();
  }

  /**
   * Registers model on connection.
   * @param {Model} model
   */
  registerModel(model) {
    if (!(model instanceof Model)) {
      throw new InvalidOperationError('ConnectionManager can register only instances of Model class.');
    }

    const connection = _connection.get(this);
    const { name, schema } = model;
    return connection.model(name, schema);
  }
}

module.exports = DatabaseConnectionManager;
/**
 * @typedef {import('../configuration/database')} DatabaseConfiguration
 * @typedef {import('./model')} Model
 */
