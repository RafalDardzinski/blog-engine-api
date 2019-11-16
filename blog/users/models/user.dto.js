const { DataTransferObject } = require('../../../core').Generics;

/**
 * Used for transferring data between controllers / clients.
 */
class UserDto extends DataTransferObject {
  constructor({
    username, email,
  }) {
    super();
    this.username = username;
    this.email = email;
    this.removeUndefined();
  }
}

module.exports = UserDto;
