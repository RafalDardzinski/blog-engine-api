const { Model, SchemaBuilder } = require('../../../database');

const SaltsManagementPlugin = require('./salts-management.plugin');
const credentialSchemaBase = require('./credential.schema');

const saltsManagementPlugin = new SaltsManagementPlugin(32);

const credentialSchema = new SchemaBuilder()
  .create(credentialSchemaBase)
  .addPlugin(saltsManagementPlugin)
  .build();

const credentialDatabaseModel = new Model('Credential', credentialSchema);

module.exports = {
  credentialDatabaseModel,
};
