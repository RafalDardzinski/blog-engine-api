const { Model, SchemaBuilder } = require('../../../database');

const groupDtos = require('./group.dto');
const groupDatabaseModelSchema = require('./group.schema');
const VirtualsPlugin = require('./virtuals.plugin');
const GroupQueryFilter = require('./group-query-filter');
const MembersManagementPlugin = require('./members-management.plugin');
const PermissionsManagementPlugin = require('./permissions-management.plugin');

const schemaBuilder = new SchemaBuilder();
const groupSchema = schemaBuilder.create(groupDatabaseModelSchema)
  .addPlugin(new VirtualsPlugin())
  .addPlugin(new PermissionsManagementPlugin())
  .addPlugin(new MembersManagementPlugin())
  .build();

const groupDatabaseModel = new Model('Group', groupSchema);

module.exports = {
  groupDatabaseModel,
  GroupQueryFilter,
  ...groupDtos,
};
