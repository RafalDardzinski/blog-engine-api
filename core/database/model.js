const { InvalidOperationError } = require('../error/core');

const _isRegistered = new WeakMap();
const _internalModel = new WeakMap();

/**
 * Represents database model.
 */
class Model {
  /**
   * @param {String} name Model name.
   * @param {MongooseSchema} schema Model schema.
   */
  constructor(name, schema) {
    this.name = name;
    this.schema = schema;
    _isRegistered.set(this, false);
  }

  /**
   * Informs if model is registered on a connection.
   * @returns {Boolean} True if model is registered.
   */
  get isRegistered() {
    return _isRegistered.get(this);
  }

  /**
   * Queries the internal model on repository.
   * @throws {InvalidOperationError} Model must be registered on a connection.
   * @returns {MongooseModel} Internal registered mongoose model.
   */
  query() {
    if (!this.isRegistered) {
      throw new InvalidOperationError(`${this.name} model is not registered on any connection.`);
    }
    return _internalModel.get(this);
  }

  /**
   * Registers itself on connection manager.
   * @param {ConnectionManager} connectionManager Connection to register itself on.
   */
  registerSelf(connectionManager) {
    const { name, isRegistered } = this;
    if (isRegistered) {
      throw new InvalidOperationError(`${name} model is already registered.`);
    }
    const registeredModel = connectionManager.registerModel(this);
    _isRegistered.set(this, true);
    _internalModel.set(this, registeredModel);
  }
}

module.exports = Model;
/**
 * @typedef {import('mongoose').Schema} MongooseSchema
 * @typedef {import('mongoose').Model} MongooseModel
 * @typedef {import('./connection-manager')} ConnectionManager
 */
