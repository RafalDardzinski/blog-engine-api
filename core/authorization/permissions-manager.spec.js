// Global imports
const chai = require('chai');

// Local imports
const PermissionsManager = require('./permissions-manager');
const Permission = require('./permission');
const { Engine: { InvalidOperationError } } = require('../error');

// Test suite setup
const { expect } = chai;

describe(`PermissionsManager ${__dirname}`, () => {
  let permission1;
  let permission2;
  let permission3;
  let permissionsList;

  /** @type {PermissionsManager} */
  let unitUnderTest;

  beforeEach(() => {
    permission1 = new Permission('permission_1', 'permission_1_description');
    permission2 = new Permission('permission_2', 'permission_2_description');
    permission3 = new Permission('permission_3', 'permission_3_description');
    permissionsList = [permission3, permission1, permission2];
    unitUnderTest = new PermissionsManager();
  });

  describe('PermissionsManager#isLocked', () => {
    it('returns false by default', () => {
      expect(unitUnderTest.isLocked).to.equal(false);
    });
  });

  describe('PermissionsManager#registerPermission(permission)', () => {
    it('registers provided permission by within internal storage by it\'s name', () => {
      // Arrange + Act
      unitUnderTest.registerPermission(permission1);

      // Assert
      expect(unitUnderTest.getPermission(permission1.name)).to.equal(permission1);
    });

    describe('throws InvalidOperationError when...', () => {
      it('permission is invalid type', () => {
        // Arrange
        const invalidPermissionType = { name: 'invalid', description: 'invalid_description' };

        // Act
        const act = () => unitUnderTest.registerPermission(invalidPermissionType);

        // Assert
        expect(act).to.throw(InvalidOperationError);
      });

      it('PermissionsManager is locked', () => {
        // Arrange
        unitUnderTest.lock();

        // Act
        const act = () => unitUnderTest.registerPermission(permission1);

        // Assert
        expect(act).to.throw(InvalidOperationError);
      });

      it('there is already permission registered with provided permission#name', () => {
        // Arrange
        unitUnderTest.registerPermission(permission1);
        const permissionWithDuplicatedName = new Permission(permission1.name, 'random_description');

        // Act
        const act = () => unitUnderTest.registerPermission(permissionWithDuplicatedName);

        // Assert
        expect(act).to.throw(InvalidOperationError);
      });
    });
  });

  describe('PermissionsManager#getRegisteredPermissions()', () => {
    it('returns array of registered permissions sorted by name', () => {
      // Arrange
      permissionsList.forEach(p => unitUnderTest.registerPermission(p));
      const sortedPermissionNames = permissionsList.map(p => p.name).sort();

      // Act
      const result = unitUnderTest.getRegisteredPermissions();

      // Assert
      permissionsList.forEach((permission, index) => {
        expect(result).to.include(permission, `${permission.name} was not returned.`);
        expect(result[index].name).to.equal(sortedPermissionNames[index], `List of permissions does not seem to be sorted. ${permission.name} is on invalid position.`);
      });
    });
  });

  describe('PermissionsManager#getPermission(permissionName)', () => {
    it('returns permission registered with provided permissionName', () => {
      // Arrange
      unitUnderTest.registerPermission(permission1);

      // Act
      const result = unitUnderTest.getPermission(permission1.name);

      // Assert
      expect(result).to.equal(permission1);
    });

    describe('when no permission was registered with provided permissionName...', () => {
      it('returns undefined', () => {
        // Act
        const result = unitUnderTest.getPermission(permission1.name);

        // Assert
        expect(result).to.equal(undefined);
      });
    });
  });

  describe('PermissionsManager#isPermissionRegistered(permissionName)', () => {
    it('returns true if there is permission registered with provided permissionName', () => {
      // Arrange
      unitUnderTest.registerPermission(permission1);

      // Act
      const result = unitUnderTest.isPermissionRegistered(permission1.name);

      // Assert
      expect(result).to.equal(true);
    });

    it('returns false if there is no permission registered with provided permissionName', () => {
      // Act
      const result = unitUnderTest.isPermissionRegistered(permission1.name);

      // Assert
      expect(result).to.equal(false);
    });
  });

  describe('PermissionsManager#lock()', () => {
    it('locks PermissionManager', () => {
      // Act
      unitUnderTest.lock();

      // Assert
      expect(unitUnderTest.isLocked).to.equal(true);
    });
  });
});
