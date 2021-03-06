const { Model, SchemaBuilder } = require('../../../database');
const { Hashing: { HashingServiceFactory } } = require('../../../services');

const userDtos = require('./user.dto');
const PasswordUtiltitiesPlugin = require('./password-utilities.plugin');
const userSchemaObj = require('./user.schema');

const schemaBuilder = new SchemaBuilder();
schemaBuilder.create(userSchemaObj);

const hashingService = HashingServiceFactory.create();
const passwordUtilities = new PasswordUtiltitiesPlugin(hashingService);
schemaBuilder.addPlugin(passwordUtilities);

const userSchema = schemaBuilder.build();
const userDatabaseModel = new Model('User', userSchema);

module.exports = {
  userDatabaseModel,
  ...userDtos,
};
