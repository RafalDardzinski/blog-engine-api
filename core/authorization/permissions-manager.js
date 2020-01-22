const { Engine: { InvalidOperationError } } = require('../error');
const Permission = require('./permission');

const _permissionsStorage = new WeakMap();
const _isLocked = new WeakMap();

function _sortByNameAsc(a, b) {
  return (a.name < b.name) ? -1 : 1;
}

/**
 * Provides utility to manage permissions internal storage.
 */
class PermissionsManager {
  constructor() {
    const storage = new Map();
    _permissionsStorage.set(this, storage);
    _isLocked.set(this, false);
  }

  /**
   * Informs if this instance of PermissionsManager is locked for modifications.
   * @returns {Boolean} PermissionsManager's lock status.
   */
  get isLocked() {
    return _isLocked.get(this);
  }


  /**
   * Lists all available permissions.
   * @returns {Permission[]} List of permissions sorted by Permission#name.
   */
  getAvailablePermissions() {
    /** @type {Map<string, Permission>} */
    const storage = _permissionsStorage.get(this);
    const permissions = [];
    storage.forEach(permission => permissions.push(permission));
    return permissions.sort(_sortByNameAsc);
  }

  /**
   * Registers permission within internal storage.
   * @param {Permission} permission Instance of Permission class to register.
   * @throws Parameter 'permission' must be an instance of Permission class.
   * @throws Each permission must have unique name.
   * @throws PermissionsManager must not be locked.
   */
  registerPermission(permission) {
    if (!(permission instanceof Permission)) {
      throw new InvalidOperationError('Cannot register object that is not an instance of Permission class.');
    }

    if (this.isLocked) {
      throw new InvalidOperationError('Cannot register new permissions when PermissionsManager is locked.');
    }

    /** @type {Map<string, Permission>} */
    const storage = _permissionsStorage.get(this);
    if (storage.has(permission.name)) {
      throw new InvalidOperationError(`Cannot register duplicate permissions: ${permission.name} is already registered.`);
    }

    storage.set(permission.name, permission);
  }

  /**
   * Gets permission by its name.
   * @param {String} permissionName Permission's name.
   * @returns {Permission} Permission mathing provided name if it was registered.
   */
  getPermission(permissionName) {
    /** @type {Map<string, Permission>} */
    const storage = _permissionsStorage.get(this);
    return storage.get(permissionName);
  }

  isPermissionRegistered(permissionName) {
    return !!this.getPermission(permissionName);
  }

  /**
   * Locks this instance of PermissionsManager to prevent further modifications.
   */
  lock() {
    _isLocked.set(this, true);
  }
}

module.exports = PermissionsManager;
/**
 * @typedef {import('../services/hashing/hashing-service')} HashingService
 */
