const { SchemaPathValidator } = require('../../../core/database');

const _validatePermissionsFactory = permissionsManager => (
  function validatePermissions(permissionsToSave) {
    const arePermissionsRegistered = permissionsToSave
      .every(permission => permissionsManager.isPermissionRegistered(permission));
    return arePermissionsRegistered;
  });


const _errorCallbackFactory = permissionsManager => (
  function errorCallback(errorDetails) {
    const permissionsToSave = errorDetails.value;
    const invalidPermission = permissionsToSave
      .find(permission => !permissionsManager.isPermissionRegistered(permission));
    return `Unrecognized permission type: ${invalidPermission}`;
  }
);

class PermissionsValidator extends SchemaPathValidator {
  constructor(permissionsManager) {
    super(
      _validatePermissionsFactory(permissionsManager),
      _errorCallbackFactory(permissionsManager),
    );
  }
}

module.exports = PermissionsValidator;
