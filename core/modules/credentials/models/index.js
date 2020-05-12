const { Model, SchemaBuilder } = require('../../../database');

const credentialSchemaBase = require('./credential.schema');

const credentialSchema = new SchemaBuilder()
  .create(credentialSchemaBase)
  .build();

const credentialDatabaseModel = new Model('Credential', credentialSchema);

module.exports = {
  credentialDatabaseModel,
};
