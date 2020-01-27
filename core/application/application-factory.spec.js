// Global imports
const chai = require('chai');
const spies = require('chai-spies');

// Local imports
const ApplicationFactory = require('./application-factory');
const Application = require('./application');
const { DatabaseConnectionManager } = require('../database');

// Mocks
class ApplicationModulesManagerMock {
  registerModule() {}

  registerPermissions() {}

  initializeModules() {}
}

class WebApplicationBuilderMock {
  build() {
    return function webApplicationMock() {};
  }
}

class PermissionsManagerMock {
  lock() {}
}

class ApplicationModuleMock {}

class DatabaseConnectionManagerMock extends DatabaseConnectionManager {
  constructor() {
    super(() => null, {});
  }
}

// Test suite setup
chai.use(spies);
const sandbox = chai.spy.sandbox();
const { expect } = chai;

describe(`ApplicationFactory ${__dirname}`, () => {
  let coreApplicationModule1;
  let coreApplicationModule2;

  let coreApplicationModules;
  let webApplicationBuilder;
  let permissionsManager;
  let applicationModulesManager;

  let applicationModule1;
  let applicationModule2;

  let applicationModules;
  let databaseConnectionManager;

  /** @type {ApplicationFactory} */
  let unitUnderTest;

  beforeEach(() => {
    coreApplicationModule1 = new ApplicationModuleMock();
    coreApplicationModule2 = new ApplicationModuleMock();

    coreApplicationModules = { coreApplicationModule1, coreApplicationModule2 };
    webApplicationBuilder = new WebApplicationBuilderMock();
    permissionsManager = new PermissionsManagerMock();
    applicationModulesManager = new ApplicationModulesManagerMock();

    applicationModule1 = new ApplicationModuleMock();
    applicationModule2 = new ApplicationModuleMock();

    applicationModules = { applicationModule1, applicationModule2 };
    databaseConnectionManager = new DatabaseConnectionManagerMock();

    // Prepares unique property to differ it from other objects.
    permissionsManager[Date.now().toString()] = 'uniqueId';

    unitUnderTest = new ApplicationFactory(
      coreApplicationModules,
      webApplicationBuilder,
      permissionsManager,
      applicationModulesManager,
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor(coreApplicationModules, webApplicationBuilder, permissionsManager, applicationModulesManager)', () => {
    it('does not reveal coreApplicationModules', () => {
      // Arrange + Act
      const publicProps = Object.values(unitUnderTest);

      // Assert
      expect(publicProps).to.not.include(coreApplicationModules);
    });

    it('does not reveal webApplicationBuilder', () => {
      // Arrange + Act
      const publicProps = Object.values(unitUnderTest);

      // Assert
      expect(publicProps).to.not.include(webApplicationBuilder);
    });

    it('does not reveal permissionsManager', () => {
      // Arrange + Act
      const publicProps = Object.values(unitUnderTest);

      // Assert
      expect(publicProps).to.not.include(permissionsManager);
    });

    it('does not reveal applicationModulesManager', () => {
      // Arrange + Act
      const publicProps = Object.values(unitUnderTest);

      // Assert
      expect(publicProps).to.not.include(applicationModulesManager);
    });
  });

  describe('ApplicationModulesManagerMock#create(applicationModules, databaseConnectionManager)', () => {
    it('registers coreApplicationModules within applicationModulesManager', () => {
      // Arrange
      sandbox.on(applicationModulesManager, 'registerModule');
      const coreModulesEntries = Object.entries(coreApplicationModules);

      // Act
      unitUnderTest.create(applicationModules, databaseConnectionManager);

      // Assert
      coreModulesEntries.forEach(([coreModuleName, coreModule]) => {
        expect(applicationModulesManager.registerModule).to.have.been.called
          .with.exactly(coreModuleName, coreModule);
      });
    });

    it('registers applicationModules within applicationModulesManager', () => {
      // Arrange
      sandbox.on(applicationModulesManager, 'registerModule');
      const applicationModulesEntries = Object.entries(applicationModules);

      // Act
      unitUnderTest.create(applicationModules, databaseConnectionManager);

      // Assert
      applicationModulesEntries.forEach(([applicationModuleName, applicationModule]) => {
        expect(applicationModulesManager.registerModule).to.have.been.called
          .with.exactly(applicationModuleName, applicationModule);
      });
    });

    it('registers coreApplicationModules before applicationModules', () => {
      // Arrange
      sandbox.on(applicationModulesManager, 'registerModule');
      const coreModulesEntries = Object.entries(coreApplicationModules);
      const applicationModulesEntries = Object.entries(applicationModules);
      const correctlyOrderedModulesEntries = [...coreModulesEntries, ...applicationModulesEntries];

      // Act
      unitUnderTest.create(applicationModules, databaseConnectionManager);

      // Assert
      correctlyOrderedModulesEntries.forEach((moduleEntry, index) => {
        if (index < coreModulesEntries.length) {
          // Ensure core modules come first.
          expect(coreModulesEntries).to.include(moduleEntry);
        }

        const [appModuleName, appModule] = moduleEntry;
        expect(applicationModulesManager.registerModule).to.have.been.nth(index + 1).called
          .with.exactly(appModuleName, appModule);
      });
    });

    it('registers permissions within applicationModulesManager', () => {
      // Arrange
      sandbox.on(applicationModulesManager, 'registerPermissions');

      // Act
      unitUnderTest.create({}, databaseConnectionManager);

      // Assert
      expect(applicationModulesManager.registerPermissions).to.have.been.called
        .with.exactly(permissionsManager);
    });

    it('locks permissionsManager', () => {
      // Arrange
      sandbox.on(permissionsManager, 'lock');

      // Act
      unitUnderTest.create({}, databaseConnectionManager);

      // Assert
      expect(permissionsManager.lock).to.have.been.called();
    });

    it('builds webApplication using applicationModulesManager', () => {
      // Arrange
      sandbox.on(webApplicationBuilder, 'build');

      // Act
      unitUnderTest.create({}, databaseConnectionManager);

      // Assert
      expect(webApplicationBuilder.build).to.have.been.called
        .with.exactly(applicationModulesManager);
    });

    it('returns instance of Application', () => {
      // Arrange + Act
      const result = unitUnderTest.create({}, databaseConnectionManager);

      // Assert
      expect(result).to.be.an.instanceOf(Application);
    });
  });
});
