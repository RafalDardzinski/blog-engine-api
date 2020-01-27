const { SchemaPlugin } = require('../../database');

const _permissionValidator = new WeakMap();

class PermissionPlugin extends SchemaPlugin {
  /**
   * @param {PermissionValidator} permissionValidator Instance of PermissionValidator class.
   */
  constructor(permissionValidator) {
    super();
    _permissionValidator.set(this, permissionValidator);
  }

  /**
   * @param {MongooseSchema} schema Database schema.
   */
  functionality(schema) {
    const permissionValidator = _permissionValidator.get(this);
    schema.path('name').validate(permissionValidator.getValidationConfig());
  }
}

module.exports = PermissionPlugin;
/**
 * @typedef {import('mongoose').Schema} MongooseSchema
 * @typedef {import('./permission-validator')} PermissionValidator
 */
