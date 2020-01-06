const Joi = require('@hapi/joi');

const { SchemaPlugin } = require('../../../core/database');
const { Engine: { InvalidOperationError } } = require('../../../core/error');

const _permissionsValidator = new WeakMap();

/**
 * Checks if instance of a group contains 'permissions' path.
 * @param {MongooseDocument} docInstance Instance of a group.
 */
function _checkPermissionsPathPresence(docInstance) {
  Joi.assert(docInstance.permissions, Joi.array().exist(), new InvalidOperationError('Group instance must contain \'permissions\' path fetched.'));
}

/**
 * Removes duplicate entries from 'permissions' path.
 * @param {MongooseDocument} groupEntity Instance of a group.
 */
function _removeDuplicatePermissions(groupEntity) {
  const hasDuplicates = groupEntity.permissions
    .some((permission, index) => groupEntity.permissions.indexOf(permission) !== index);

  if (hasDuplicates) {
    groupEntity.set('permissions', Array.from(new Set(groupEntity.permissions)));
  }
}

/**
 * Adds permissions to the group.
 * @param {String[]} permissionsToAdd Permissions to add.
 */
function _addPermissions(permissionsToAdd = []) {
  _checkPermissionsPathPresence(this);
  permissionsToAdd.forEach(p => this.permissions.push(p));
}

/**
 * Removes permissions from the group.
 * @param {String[]} permissionsToRemove Permissions to remove.
 */
function _removePermissions(permissionsToRemove = []) {
  _checkPermissionsPathPresence(this);
  const permissionsInGroup = permissionsToRemove.filter(p => this.permissions.indexOf(p) > -1);
  permissionsInGroup.forEach((p) => {
    this.permissions.splice(this.permissions.indexOf(p), 1);
  });
}

/**
 * Provides functionalities for managing group permissions.
 */
class PermissionsManagementPlugin extends SchemaPlugin {
  constructor(permissionsValidator) {
    super();
    _permissionsValidator.set(this, permissionsValidator);
  }

  /**
   * @param {MongooseSchema} schema Database schema.
   */
  functionality(schema) {
    /** @type {SchemaPathValidator} */
    const permissionsValidator = _permissionsValidator.get(this);
    schema.path('permissions').validate(permissionsValidator.getValidationConfig());

    schema.post('validate', _removeDuplicatePermissions);
    schema.method('addPermissions', _addPermissions);
    schema.method('removePermissions', _removePermissions);
  }
}

module.exports = PermissionsManagementPlugin;
/**
 * @typedef {import('mongoose').Schema} MongooseSchema
 * @typedef {import('../../../core/database/schema-path-validator')} SchemaPathValidator
 */
