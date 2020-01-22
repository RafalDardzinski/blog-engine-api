const PermissionValidator = require('./permission-validator');
const PermissionPlugin = require('./permission-validator.plugin');
const permissionSchemaObj = require('./permission.schema');

const { SchemaBuilder } = require('../../database');

class PermissionSchemaFactory {
  static create(permissionsManager) {
    const schemaBuilder = new SchemaBuilder();
    schemaBuilder.create(permissionSchemaObj, { _id: false });

    const permissionValidator = new PermissionValidator(permissionsManager);
    const permissionPlugin = new PermissionPlugin(permissionValidator);

    schemaBuilder.addPlugin(permissionPlugin);
    return schemaBuilder.build();
  }
}

module.exports = {
  PermissionSchemaFactory,
};
