const { Model } = require('../../../core').Database;

const { UserCreateEntity, UserUpdateEntity } = require('./user.entities');
const UserDto = require('./user.dto');
const userDatabaseModelSchema = require('./user.dbmodel.schema');

const userDatabaseModel = new Model('User', userDatabaseModelSchema);

module.exports = {
  UserDto,
  UserCreateEntity,
  UserUpdateEntity,
  userDatabaseModel,
};
