const { Model, SchemaBuilder } = require('../../../core').Database;
const { permissionsManager } = require('../../../core/authorization');

const groupDtos = require('./group.dto');
const groupDatabaseModelSchema = require('./group.schema');
const PermissionsValidator = require('./permissions-validator');
const VirtualsPlugin = require('./virtuals.plugin');
const MembersManagementPlugin = require('./members-management.plugin');
const PermissionsManagementPlugin = require('./permissions-management.plugin');

const permissionsValidator = new PermissionsValidator(permissionsManager);

const schemaBuilder = new SchemaBuilder();
schemaBuilder.create(groupDatabaseModelSchema);
schemaBuilder.addPlugin(new VirtualsPlugin());
schemaBuilder.addPlugin(new PermissionsManagementPlugin(permissionsValidator));
schemaBuilder.addPlugin(new MembersManagementPlugin());

const groupDatabaseModel = new Model('Group', schemaBuilder.build());

module.exports = {
  groupDatabaseModel,
  ...groupDtos,
};
