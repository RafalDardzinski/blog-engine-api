const { DataTransferObject } = require('../../../generics');

/**
 * Used for transferring data from service to controller.
 */
class UserDto extends DataTransferObject {
  constructor(inputDocument) {
    super(inputDocument, [
      '_id',
      'username',
      'email',
    ]);
  }
}

/**
 * Used for destructuring input for creating users.
 */
class UserCreate extends DataTransferObject {
  constructor(inputDocument) {
    super(inputDocument, [
      'username',
      'password',
      'email',
    ]);
  }
}

/**
 * Used for destructuring input for updating users.
 */
class UserUpdate extends DataTransferObject {
  constructor(inputDocument) {
    super(inputDocument, [
      'email',
      'isActive',
    ]);
  }
}

module.exports = {
  UserDto,
  UserCreate,
  UserUpdate,
};
