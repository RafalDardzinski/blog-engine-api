const { Model, SchemaBuilder } = require('../../../core').Database;

const groupDtos = require('./group.dto');
const groupDatabaseModelSchema = require('./group.schema');
const VirtualsPlugin = require('./virtuals.plugin');
const GroupQueryFilter = require('./group-query-filter');
const MembersManagementPlugin = require('./members-management.plugin');
const PermissionsManagementPlugin = require('./permissions-management.plugin');

const schemaBuilder = new SchemaBuilder();
schemaBuilder.create(groupDatabaseModelSchema);
schemaBuilder.addPlugin(new VirtualsPlugin());
schemaBuilder.addPlugin(new PermissionsManagementPlugin());
schemaBuilder.addPlugin(new MembersManagementPlugin());

const groupDatabaseModel = new Model('Group', schemaBuilder.build());

module.exports = {
  groupDatabaseModel,
  GroupQueryFilter,
  ...groupDtos,
};
