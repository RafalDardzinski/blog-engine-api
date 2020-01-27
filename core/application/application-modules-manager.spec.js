// Global imports
const chai = require('chai');

// Local imports
const ApplicationModulesManager = require('./application-modules-manager');
const ApplicationModule = require('./application-module');
const { Engine: { InvalidOperationError } } = require('../error');

// Mocks
class RepositoryMock {
  constructor(id) {
    this.___testId = `Repository${id}`;
  }
}

class ServiceMock {
  constructor(id) {
    this.___testId = `Service${id}`;
  }
}

class ControllerMock {
  constructor(id) {
    this.___testId = `Controller${id}`;
  }
}

class DatabaseConnectionManagerMock {
  registerModel() {}
}

class ModuleMock extends ApplicationModule {
  initializeRepository() {}
}

class PermissionsManagerMock {
  registerPermission() {}
}

// Test suite setup
const { expect } = chai;

describe(`ApplicationModulesManager ${__dirname}`, () => {
  let repository1;
  let service1;
  let controller1;
  let permissions1;

  let repository2;
  let service2;
  let controller2;
  let permissions2;

  let databaseConnectionManager;
  let applicationModule1;
  let applicationModule2;
  let applicationModules;

  /** @type {ApplicationModulesManager} */
  let unitUnderTest;

  beforeEach(() => {
    repository1 = new RepositoryMock(1);
    service1 = new ServiceMock(1);
    controller1 = new ControllerMock(1);
    permissions1 = ['perm1_1', 'perm1_2'];

    repository2 = new RepositoryMock(2);
    service2 = new ServiceMock(2);
    controller2 = new ControllerMock(2);
    permissions2 = ['perm2_1', 'perm2_2'];

    databaseConnectionManager = new DatabaseConnectionManagerMock();
    applicationModule1 = new ModuleMock(repository1, service1, controller1, permissions1);
    applicationModule2 = new ModuleMock(repository2, service2, controller2, permissions2);
    applicationModules = { applicationModule1, applicationModule2 };

    unitUnderTest = new ApplicationModulesManager();

    unitUnderTest.registerModule('module1', applicationModule1);
    unitUnderTest.registerModule('module2', applicationModule2);
  });

  describe('constructor(modules)', () => {
    it('does not reveal modules', () => {
      // Act
      const publicPropsValues = Object.values(unitUnderTest);

      // Assert
      expect(publicPropsValues).to.not.include(applicationModules);
    });
  });

  describe('ApplicationModulesManager#controllers', () => {
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
      expect(result).to.include
        .members([applicationModule1.controller, applicationModule2.controller]);
    });
  });

  describe('ApplicationModulesManager#initializeModules(databaseConnectionManager)', () => {
    it('initializes each module\'s repository with databaseConnectionManager', () => {
      // Arrange
      applicationModule1.initializeRepository = chai.spy(() => null);
      applicationModule2.initializeRepository = chai.spy(() => null);
      const modulesList = Object.values(applicationModules);

      // Act
      unitUnderTest.initializeModules(databaseConnectionManager);

      // Assert
      modulesList.forEach((module) => {
        expect(module.initializeRepository).to.have.been.called
          .with.exactly(databaseConnectionManager);
      });
    });
  });

  describe('ApplicationModulesManager#registerModule(name, applicationModule)', () => {
    it('registers module within internal storage', () => {
      // Assert
      expect(unitUnderTest.controllers).to.include(controller1);
    });

    describe('throws error when...', () => {
      it('is called with \'name\' that is not a string or is not defined', () => {
        // Arrange
        const invalidNameValues = [
          '',
          undefined,
          null,
          22,
          {},
        ];

        // Act
        const acts = invalidNameValues.map(invalidValue => () => unitUnderTest
          .registerModule(invalidValue, applicationModule1));

        // Assert
        acts.forEach((act) => {
          expect(act).to.throw('Parameter \'name\'');
        });
      });

      it('is called with \'applicationModule\' is not an Instance of ApplicationModule', () => {
        // Arrange
        const invalidModule = {};

        // Act
        const act = () => unitUnderTest.registerModule('uniqueName', invalidModule);

        // Assert
        expect(act).to.throw('Parameter \'applicationModule\'');
      });

      it('is called with \'applicationModule\' that is not defined', () => {
        // Arrange + Act
        const act = () => unitUnderTest.registerModule('uniqueName');

        // Assert
        expect(act).to.throw('Parameter \'applicationModule\'');
      });

      it('is called with \'name\' parameter that was already registered', () => {
        // Arrange
        const name = 'uniqueName';
        unitUnderTest.registerModule(name, applicationModule1);

        // Act
        const act = () => unitUnderTest.registerModule(name, applicationModule2);

        // Assert
        expect(act).to.throw(InvalidOperationError, `${name}`);
      });
    });
  });

  describe('ApplicationModulesManager#registerPermissions(permissionsManager)', () => {
    it('registers each module\'s permission within provided permissionsManager', () => {
      // Arrange
      const permissionsManager = new PermissionsManagerMock();
      permissionsManager.registerPermission = chai.spy(() => null);
      const permissionsList = [
        ...applicationModule1.permissions,
        ...applicationModule1.permissions,
      ];

      // Act
      unitUnderTest.registerPermissions(permissionsManager);

      // Assert
      permissionsList.forEach((permission) => {
        expect(permissionsManager.registerPermission).to.have.been.called
          .with.exactly(permission);
      });
    });
  });
});
