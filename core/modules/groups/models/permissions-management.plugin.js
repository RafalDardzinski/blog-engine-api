const Joi = require('@hapi/joi');

const { SchemaPlugin } = require('../../../database');
const { Engine: { InvalidOperationError } } = require('../../../error');

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
  const duplicatedPermissions = groupEntity.permissions.filter((permission, index, permissions) => {
    const firstOccurenceIndex = permissions.findIndex((p => p.name === permission.name));
    return index !== firstOccurenceIndex;
  });

  duplicatedPermissions.forEach((duplicatePermission) => {
    const duplicatePermissionIndex = groupEntity.permissions.indexOf(duplicatePermission);
    groupEntity.permissions.splice(duplicatePermissionIndex, 1);
  });
}

/**
 * Adds permissions to the group.
 * @param {String[]} permissionNameToAdd Permissions to add.
 */
function _addPermissions(permissionNameToAdd = []) {
  _checkPermissionsPathPresence(this);
  permissionNameToAdd.forEach(p => this.permissions.push({ name: p }));
}

/**
 * Removes permissions from the group.
 * @param {String[]} permissionNamesToRemove Permissions to remove.
 */
function _removePermissions(permissionsToRemoveNames = []) {
  _checkPermissionsPathPresence(this);

  permissionsToRemoveNames.forEach((permissionToRemoveName) => {
    const indexInGroupPermissions = this.permissions
      .findIndex(p => p.name === permissionToRemoveName);

    if (indexInGroupPermissions !== -1) {
      this.permissions.splice(indexInGroupPermissions, 1);
    }
  });
}

/**
 * Provides functionalities for managing group permissions.
 */
class PermissionsManagementPlugin extends SchemaPlugin {
  /**
   * @param {MongooseSchema} schema Database schema.
   */
  functionality(schema) {
    /** @type {SchemaPathValidator} */
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
