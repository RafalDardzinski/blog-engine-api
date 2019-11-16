const { ValidatedEntity } = require('../../../core').Generics;
const { userCreateSchema, userUpdateSchema } = require('./user.entity.schemas');

/**
 * Used for filtering input coming from the client in order to create a User.
 */
class UserCreateEntity extends ValidatedEntity {
  constructor({
    username,
    password,
    email,
  }) {
    super(userCreateSchema);
    this.username = username;
    this.password = password;
    this.email = email;
    this.validateSelf();
  }
}

/**
 * Used for filtering input coming from the client in order to update a user.
 */
class UserUpdateEntity extends ValidatedEntity {
  constructor({
    email,
    isActive,
  }) {
    super(userUpdateSchema);
    this.email = email;
    this.isActive = isActive;
    this.validateSelf();
  }
}

module.exports = {
  UserCreateEntity,
  UserUpdateEntity,
};
