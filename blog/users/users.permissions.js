const { Permission } = require('../../core/authorization');

/**
 * Represents permissions for operations in Users module.
 * @enum {String}
 */
const USERS_PERMISSIONS = {
  CREATE: new Permission('users_create'),
  READ: new Permission('users_read'),
  UPDATE: new Permission('users_update'),
  DELETE: new Permission('users_delete'),
};

Object.freeze(USERS_PERMISSIONS);
module.exports = USERS_PERMISSIONS;
