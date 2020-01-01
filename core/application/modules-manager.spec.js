// Global imports
const chai = require('chai');

// Local imports
const ModulesManager = require('./modules-manager');
const { InvalidOperationError } = require('../error/core');

// Mocks
class DatabaseConnectionManagerMock {
  registerModel() {}
}

class ModuleMock {
  constructor(repository, service, controller, permissions) {
    this.repository = repository;
    this.service = service;
    this.controller = controller;
    this.permissions = permissions;
  }

  initializeRepository() {}
}

class PermissionsManagerMock {
  registerPermissions() {}
}

// Test suite setup
const { expect } = chai;

describe(`ModulesManager ${__dirname}`, () => {
  let databaseConnectionManager;
  let module1;
  let module2;
  let modules;

  /** @type {ModulesManager} */
  let unitUnderTest;

  beforeEach(() => {
    databaseConnectionManager = new DatabaseConnectionManagerMock();
    module1 = new ModuleMock({}, {}, {}, {});
    module2 = new ModuleMock({}, {}, {}, {});
    modules = { module1, module2 };
    unitUnderTest = new ModulesManager(modules);
  });

  describe('constructor(modules)', () => {
    it('does not reveal modules', () => {
      // Act
      const publicPropsValues = Object.values(unitUnderTest);

      // Assert
      expect(publicPropsValues).to.not.include(modules);
    });
  });

  describe('ModulesManager#controllers', () => {
    it('is readonly', () => {
      // Arrange
      const oldValue = unitUnderTest.controllers;

      // Act
      unitUnderTest.controllers = 'test';

      // Assert
      expect(unitUnderTest.controllers).to.deep.equal(oldValue);
    });

    it('returns array of each modules\' controllers', () => {
      // Act
      const result = unitUnderTest.controllers;

      // Assert
      expect(result).to.include.members([module1.controller, module2.controller]);
    });
  });

  describe('ModulesManager#getService(name)', () => {
    it('returns a service from from module registered with a provided name', () => {
      // Arrange
      const moduleName = 'testModule';
      const testModule = {
        service: {},
      };
      modules[moduleName] = testModule;

      // Act
      const result = unitUnderTest.getService('testModule');

      // Assert
      expect(result).to.equal(testModule.service);
    });

    describe('when there is no module registered with provided name', () => {
      it('throws InvalidOperationError', () => {
        // Arrange
        const invalidModuleName = 'invalidModuleName';

        // Act
        const act = () => unitUnderTest.getService(invalidModuleName);

        // Assert
        expect(act).to.throw(InvalidOperationError);
      });
    });
  });

  describe('ModulesManager#initializeModules(databaseConnectionManager)', () => {
    it('initializes each module\'s repository with databaseConnectionManager', () => {
      // Arrange
      module1.initializeRepository = chai.spy(() => null);
      module2.initializeRepository = chai.spy(() => null);
      const modulesList = Object.values(modules);

      // Act
      unitUnderTest.initializeModules(databaseConnectionManager);

      // Assert
      modulesList.forEach((module) => {
        expect(module.initializeRepository).to.have.been.called
          .with.exactly(databaseConnectionManager);
      });
    });
  });

  describe('ModulesManager#registerPermissions(permissionsManager)', () => {
    it('registers each module\'s permission within provided permissionsManager', () => {
      // Arrange
      const permissionsManager = new PermissionsManagerMock();
      permissionsManager.registerPermissions = chai.spy(() => null);
      module1.permissions = ['permissions_1', 'permissions_2'];
      module2.permissions = ['permissions_3', 'permissions_4'];
      const modulesList = Object.values(modules);

      // Act
      unitUnderTest.registerPermissions(permissionsManager);

      // Assert
      modulesList.forEach((module, index) => {
        expect(permissionsManager.registerPermissions).to.have.been
          .nth(index + 1).called.with.exactly(module.permissions);
      });
    });
  });
});
