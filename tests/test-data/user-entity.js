const { Hashing: { HashingServiceFactory } } = require('../../core/services');
const { userDatabaseModel } = require('../../core/modules/users/models');
const { InitializableEntity } = require('../framework').Types;

const hashingService = HashingServiceFactory.create();

/**
 * Represents user entity.
 */
class UserEntity extends InitializableEntity {
  constructor({
    username, password, email, isActive,
  }) {
    super(userDatabaseModel.name);
    this.username = username;
    this.password = password;
    this.email = email;
    this.isActive = isActive || true;
  }

  async initialize() {
    const { value, salt } = await hashingService.hash(this.password);
    this.password = { value, salt };
  }
}

module.exports = UserEntity;
