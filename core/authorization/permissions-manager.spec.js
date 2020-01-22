// Global imports
const chai = require('chai');

// Local imports
const PermissionsManager = require('./permissions-manager');
const { Engine: { InvalidOperationError } } = require('../error');

// Test suite setup
const { expect } = chai;

describe(`PermissionsManager ${__dirname}`, () => {
  /** @type {String[]} */
  let permissions;

  /** @type {PermissionsManager} */
  let unitUnderTest;

  beforeEach(() => {
    permissions = ['permission_01', 'permission_02'];
    unitUnderTest = new PermissionsManager();
  });

  // TODO: Fix UT.
  describe('PermissionsManager#availablePermissions', () => {
    it('returns list of registered permissions', () => {
      // Arrange
      unitUnderTest.registerPermissions(permissions);

      // Act
      const result = unitUnderTest.availablePermissions;

      // Assert
      expect(result).to.deep.equal(permissions);
    });

    it('cannot be reassigned', () => {
      // Arrange
      unitUnderTest.registerPermissions(permissions);
      const oldValue = unitUnderTest.availablePermissions;
      const newValue = ['perm_test'];

      // Act
      unitUnderTest.availablePermissions = newValue;

      // Assert
      expect(unitUnderTest.availablePermissions).to.deep.equal(oldValue);
    });

    it('cannot be directly modified', () => {
      // Arrange
      const newPermission = 'newPermission';

      // Act
      unitUnderTest.availablePermissions.push(newPermission);

      // Assert
      expect(unitUnderTest.availablePermissions).to.not.include(newPermission);
    });
  });

  describe('PermissionsManager#isLocked', () => {
    it('returns true when PermissionsManager is locked', () => {
      // Arrange
      unitUnderTest.lock();

      // Act
      const result = unitUnderTest.isLocked;

      // Assert
      expect(result).to.equal(true);
    });

    it('returns false if PermissionsManager is not locked', () => {
      // Act
      const result = unitUnderTest.isLocked;

      // Assert
      expect(result).to.equal(false);
    });

    it('cannot be reassigned', () => {
      // Arrange
      unitUnderTest.lock();
      const oldValue = unitUnderTest.isLocked;

      // Act
      unitUnderTest.isLocked = false;

      // Assert
      expect(unitUnderTest.isLocked).to.equal(oldValue);
    });
  });

  describe('PermissionsManager#registerPermissions(permissions)', () => {
    it('registers provided permissions within internal storage', () => {
      // Arrange
      const morePermissions = ['permission_03', 'permission_04'];

      // Act
      unitUnderTest.registerPermissions(permissions);
      unitUnderTest.registerPermissions(morePermissions);

      // Assert
      const registeredPermissions = unitUnderTest.availablePermissions;
      const expectedRegisteredPermissions = permissions.concat(morePermissions);
      expect(registeredPermissions).to.have.members(expectedRegisteredPermissions);
    });

    describe('throws InvalidOperationError when...', () => {
      it('is locked', () => {
        // Arrange
        unitUnderTest.lock();

        // Act
        const act = () => unitUnderTest.registerPermissions(permissions);

        // Assert
        expect(act).to.throw(InvalidOperationError);
      });

      it('is trying to register permission that was already registered', () => {
        // Arrange
        unitUnderTest.registerPermissions(permissions);
        const duplicatePermissions = [permissions[0]];

        // Act
        const act = () => unitUnderTest.registerPermissions(duplicatePermissions);

        // Assert
        expect(act).to.throw(InvalidOperationError);
      });

      it('is trying to register permissions list that contains duplicates', () => {
        // Arrange
        const permission = permissions[0];
        const duplicatePermissions = [permission, permission];

        // Act
        const act = () => unitUnderTest.registerPermissions(duplicatePermissions);

        // Assert
        expect(act).to.throw(InvalidOperationError, 'duplicate entries');
      });
    });
  });

  describe('PermissionsManager#isPermissionRegistered(permission)', () => {
    it('returns true if provided permission is registered', () => {
      // Arrange
      unitUnderTest.registerPermissions(permissions);
      const permissionToCheck = permissions[0];

      // Act
      const result = unitUnderTest.isPermissionRegistered(permissionToCheck);

      // Assert
      expect(result).to.equal(true);
    });

    it('returns false if provided permission is not registered', () => {
      // Arrange
      const unregisteredPermission = 'unregistered_permission';

      // Act
      const result = unitUnderTest.isPermissionRegistered(unregisteredPermission);

      // Assert
      expect(result).to.equal(false);
    });
  });

  describe('PermissionsManager#lock()', () => {
    it('locks the instance of permission manager', () => {
      // Act
      unitUnderTest.lock();

      // Assert
      expect(unitUnderTest.isLocked).to.equal(true);
    });
  });
});
