const PermissionsManager = require('./permissions-manager');
const Permission = require('./permission');
const { PermissionSchemaFactory } = require('./models');

const permissionsManager = new PermissionsManager();
const permissionSchema = PermissionSchemaFactory.create(permissionsManager);

module.exports = {
  permissionsManager,
  permissionSchema,
  Permission,
};
