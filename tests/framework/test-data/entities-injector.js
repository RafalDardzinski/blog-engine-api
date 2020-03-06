const Joi = require('@hapi/joi');

const { Engine: { InvalidOperationError } } = require('../../../core/error');
const Entity = require('./entity');

const _affectedModels = new WeakMap();

/**
 * Registers model used to add test data.
 * @param {Model} model Database model.
 */
function _recordAffectedModel(model) {
  /** @type {Model[]} */
  const affectedModels = _affectedModels.get(this);
  if (affectedModels.includes(model)) {
    return;
  }

  affectedModels.push(model);
}

/**
 * Injects test data directly to the database (bypasses repositories). Allows
 * reverting inserted changes.
 */
class EntitiesInjector {
  constructor() {
    _affectedModels.set(this, []);
  }

  /**
   * Injects records directly to the database.
   * @param {Entity[]} records Entities to insert to Database.
   * @param {Connection} connection Database connection.
   */
  inject(records = [], connection) {
    Joi.assert(
      records, Joi.array().items(Joi.object().instance(Entity)),
      new InvalidOperationError('All test data entities must be instances of Entity class.'),
    );

    const uniqueModelNames = new Set(records.map(record => record.modelName));

    const pendingOperations = [];
    Array.from(uniqueModelNames).forEach((modelName) => {
      const model = connection.model(modelName);
      const entitiesToInsert = records.filter(r => r.modelName === modelName);
      pendingOperations.push(model.create(entitiesToInsert));
      _recordAffectedModel.call(this, model);
    });

    return Promise.all(pendingOperations);
  }

  cleanup() {
    /** @type {Model[]} */
    const affectedModels = _affectedModels.get(this);
    const pendingOperations = [];
    affectedModels.forEach((model) => {
      pendingOperations.push(model.deleteMany({}));
    });

    return Promise.all(pendingOperations);
  }
}

module.exports = EntitiesInjector;
/**
 * @typedef {import('./entity')} Entity
 * @typedef {import('mongoose').Connection} Connection
 * @typedef {import('mongoose').Model} Model
 */
