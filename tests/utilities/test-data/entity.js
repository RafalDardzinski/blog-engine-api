const { ObjectId } = require('mongoose').Types;

const _modelName = new WeakMap();

/**
 * Represents single entity. Creates _id locally for easier relationships management.
 * @abstract
 */
class Entity {
  /**
   * @param {String} modelName Name of a model the entity belongs to.
   */
  constructor(modelName) {
    _modelName.set(this, modelName);
    this._id = new ObjectId();
  }

  /**
   * Returns a name of a model that entity can be mapped to.
   * @returns {String} Name of a model the entity belongs to.
   */
  get modelName() {
    return _modelName.get(this);
  }
}

module.exports = Entity;
