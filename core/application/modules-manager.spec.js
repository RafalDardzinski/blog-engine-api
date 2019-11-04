// Global imports
const chai = require('chai');

// Local imports
const ModulesManager = require('./modules-manager');
const { InvalidOperationError } = require('../error');

// Mocks
class DatabaseConnectionManagerMock {
  registerModel() {}
}

// Test suite setup
const { expect } = chai;

describe(`ModulesManager ${__dirname}`, () => {
  let databaseConnectionManager;
  let modules;

  /** @type {ModulesManager} */
  let unitUnderTest;

  beforeEach(() => {
    databaseConnectionManager = new DatabaseConnectionManagerMock();
    modules = {};
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
      // Arrange
      const testModule1 = {
        controller: {},
      };
      const testModule2 = {
        controller: {},
      };
      modules.testModule1 = testModule1;
      modules.testModule2 = testModule2;

      // Act
      const result = unitUnderTest.controllers;

      // Assert
      expect(result).to.include.members([testModule1.controller, testModule2.controller]);
    });
  });

  describe('ModulesManager#areModulesInitialized', () => {
    it('is readonly', () => {
      // Arrange
      const oldValue = unitUnderTest.areModulesInitialized;

      // Act
      unitUnderTest.areModulesInitialized = 'test';

      // Assert
      expect(unitUnderTest.areModulesInitialized).to.equal(oldValue);
    });

    describe('when all modules are initialized...', () => {
      it('returns true', () => {
        // Arrange
        const testModule1 = {
          isInitialized: true,
        };
        const testModule2 = {
          isInitialized: true,
        };
        modules.testModule1 = testModule1;
        modules.testModule2 = testModule2;

        // Act
        const result = unitUnderTest.areModulesInitialized;

        // Assert
        expect(result).to.equal(true);
      });
    });

    describe('when at least one module is not initialized', () => {
      it('returns false', () => {
        // Arrange
        const testModule1 = {
          isInitialized: true,
        };
        const testModule2 = {
          isInitialized: false,
        };
        modules.testModule1 = testModule1;
        modules.testModule2 = testModule2;

        // Act
        const result = unitUnderTest.areModulesInitialized;

        // Assert
        expect(result).to.equal(false);
      });
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
      const testModule1 = {
        initializeRepository: chai.spy(() => null),
      };
      const testModule2 = {
        initializeRepository: chai.spy(() => null),
      };
      modules.testModule1 = testModule1;
      modules.testModule2 = testModule2;

      const modulesArray = Object.values(modules);

      // Act
      unitUnderTest.initializeModules(databaseConnectionManager);

      // Assert
      modulesArray.forEach((module) => {
        expect(module.initializeRepository).to.have.been.called
          .with(databaseConnectionManager);
      });
    });
  });
});
