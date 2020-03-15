const { Hashing: { HashingServiceFactory } } = require('../../core/services');
const { userDatabaseModel } = require('../../core/modules/users/models');
const { InitializableEntity } = require('../framework').Types;

const hashingService = HashingServiceFactory.create();

/** @type {Map<Object, string>} */
const _rawPassword = new WeakMap();

/**
 * Represents user entity.
 */
class UserEntity extends InitializableEntity {
  constructor({
    username, password, email, isActive,
  }) {
    super(userDatabaseModel.name);
    this.username = username;
    _rawPassword.set(this, password);
    this.password = null;
    this.email = email;
    this.isActive = isActive || true;
  }

  async initialize() {
    const { value, salt } = await hashingService.hash(this.getRawPassword());
    this.password = { value, salt };
  }

  getRawPassword() {
    return _rawPassword.get(this);
  }
}

module.exports = UserEntity;
