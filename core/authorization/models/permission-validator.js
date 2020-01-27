const { SchemaPathValidator } = require('../../../core/database');

/**
 * @param {PermissionsManager} permissionsManager Instance of PermissionsManager class.
 */
const _validatePermissionFactory = permissionsManager => (
  /**
   * @param {String} permissionName Name of permission to be saved.
   */
  function validatePermissionCode(permissionName) {
    return permissionsManager.isPermissionRegistered(permissionName);
  });

/**
 * @param {PermissionsManager} permissionsManager Instance of PermissionsManager class.
 */
const _errorCallbackFactory = () => (
  function errorCallback(errorDetails) {
    const invalidPermission = errorDetails.value;
    return `Unrecognized permission type: ${invalidPermission}`;
  }
);

class PermissionsValidator extends SchemaPathValidator {
  /**
   * @param {PermissionsManager} permissionsManager Instance of PermissionsManager class.
   */
  constructor(permissionsManager) {
    super(
      _validatePermissionFactory(permissionsManager),
      _errorCallbackFactory(),
    );
  }
}

module.exports = PermissionsValidator;
/**
 * @typedef {import('../permissions-manager')} PermissionsManager
 */
