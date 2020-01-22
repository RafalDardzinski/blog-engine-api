const Joi = require('@hapi/joi');

const { Engine: { InvalidOperationError } } = require('../error');

const _name = new WeakMap();
const _description = new WeakMap();

/**
 * Represents access permission.
 */
class Permission {
  /**
   * @param {String} name Name of the permission.
   * @param {String} description Permission's description.
   * @throws 'Parameter name must be provided and must be a string.'
   */
  constructor(name, description) {
    Joi.assert(name, Joi.string().exist(), new InvalidOperationError('Could not create permission: Parameter \'name\' must be provided and must be a string.'));

    _name.set(this, name);
    _description.set(this, description);
  }

  get name() {
    return _name.get(this);
  }

  get descritpion() {
    return _description.get(this);
  }
}

module.exports = Permission;
