/**
 * Represents permissions for operations in Users module.
 * @enum {String}
 */
const USERS_PERMISSIONS = {
  CREATE: 'users_create',
  READ: 'users_read',
  UPDATE: 'users_update',
  DELETE: 'users_delete',
};

Object.freeze(USERS_PERMISSIONS);
module.exports = USERS_PERMISSIONS;
