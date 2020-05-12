const { Model, SchemaBuilder } = require('../../../database');
const { Hashing: { HashingServiceFactory } } = require('../../../services');

const userDtos = require('./user.dto');
const PasswordUtiltitiesPlugin = require('./password-utilities.plugin');
const userSchemaObj = require('./user.schema');

const hashingService = HashingServiceFactory.create();
const schemaBuilder = new SchemaBuilder();

const userSchema = schemaBuilder.create(userSchemaObj)
  .addPlugin(new PasswordUtiltitiesPlugin(hashingService))
  .build();

const userDatabaseModel = new Model('User', userSchema);

module.exports = {
  userDatabaseModel,
  ...userDtos,
};
