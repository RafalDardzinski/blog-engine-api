const { Engine: { InvalidOperationError } } = require('../error');

const _availablePermissions = new WeakMap();
const _isLocked = new WeakMap();

class PermissionsManager {
  constructor() {
    _availablePermissions.set(this, []);
    _isLocked.set(this, false);
  }

  /**
   * Provides list of permission registered within PermissionManager.
   * @returns {String[]} List of registered permissions.
   */
  get availablePermissions() {
    const registeredPermissions = _availablePermissions.get(this);
    return Array.from(registeredPermissions);
  }

  /**
   * Informs if this instance of PermissionsManager is locked for modifications.
   * @returns {Boolean} PermissionsManager's lock status.
   */
  get isLocked() {
    return _isLocked.get(this);
  }

  /**
   * Registers permissions within the application.
   * @param {String[]} permissions List of permissions to register.
   * @throws {InvalidOperationError} Each permission must have unique name.
   * @throws {InvalidOperationError} PermissionsManager must not be locked.
   */
  registerPermissions(permissions) {
    if (this.isLocked) {
      throw new InvalidOperationError('Cannot register new permissions when PermissionsManager is locked.');
    }

    const doPermissionsContainDuplicates = !permissions.every((p, i, a) => a.indexOf(p) === i);
    if (doPermissionsContainDuplicates) {
      throw new InvalidOperationError('Cannot register new permissions - provided list of permissions contains duplicate entries.');
    }

    const availablePermissions = _availablePermissions.get(this);
    permissions.forEach((permission) => {
      if (availablePermissions.includes(permission)) {
        throw new InvalidOperationError(`Cannot register duplicate permissions: ${permission} is already registered.`);
      }

      availablePermissions.push(permission);
    });
  }

  /**
   * Checks if provided permission is recognized (registered within)
   * this instance of PermissionsManager.
   * @param {String} permission Permission to check.
   */
  isPermissionRegistered(permission) {
    return _availablePermissions.get(this).includes(permission);
  }

  /**
   * Locks this instance of PermissionsManager to prevent further modifications.
   */
  lock() {
    _isLocked.set(this, true);
  }
}

module.exports = PermissionsManager;
