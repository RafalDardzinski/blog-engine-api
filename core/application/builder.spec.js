// Global imports
const chai = require('chai');
const spies = require('chai-spies');

// Local imports
const ApplicationBuilder = require('./builder');
const Application = require('./application');
const { DatabaseConnectionManager } = require('../database');

// Mocks
class WebApplicationBuilderMock {
  build() {
    return function webApplication() {};
  }
}

class ModulesManagerMock {
  initializeModules() {}

  registerPermissions() {}
}

class PermissionsManagerMock {
  lock() {}
}

class DatabaseConnectionManagerMock extends DatabaseConnectionManager {
  constructor() {
    super(() => null);
  }
}

// Test suite setup
chai.use(spies);
const sandbox = chai.spy.sandbox();
const { expect } = chai;

describe(`ApplicationBuilder ${__dirname}`, () => {
  let webApplicationBuilder;
  let modulesManager;
  let databaseConnectionManager;
  let permissionsManager;

  /** @type {ApplicationBuilder} */
  let unitUnderTest;

  beforeEach(() => {
    webApplicationBuilder = new WebApplicationBuilderMock();
    permissionsManager = new PermissionsManagerMock();
    modulesManager = new ModulesManagerMock();
    databaseConnectionManager = new DatabaseConnectionManagerMock();
    unitUnderTest = new ApplicationBuilder(webApplicationBuilder, permissionsManager);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor(webApplicationBuilder)', () => {
    it('assigns webApplicationBuilder to ApplicationBuilder#webApplicationBuilder', () => {
      // Assert
      expect(unitUnderTest.webApplicationBuilder).to.equal(webApplicationBuilder);
    });

    it('assigns permissionsManager to ApplicationBuilder#permissionsManager', () => {
      // Assert
      expect(unitUnderTest.permissionsManager).to.equal(permissionsManager);
    });
  });

  describe('ApplicationBuilder#buildWebApplication(modulesManager)', () => {
    it('builds webApplication using modulesManager', () => {
      // Arrange
      sandbox.on(webApplicationBuilder, 'build');

      // Act
      unitUnderTest.buildWebApplication(modulesManager);

      // Assert
      expect(webApplicationBuilder.build).to.have.been.called
        .with(modulesManager);
    });

    it('returns built web application', () => {
      // Arrange
      const webApplication = {};
      webApplicationBuilder.build = () => webApplication;

      // Act
      const result = unitUnderTest.buildWebApplication();

      // Assert
      expect(result).to.equal(webApplication);
    });
  });

  describe('ApplicationBuilder#build(modulesManager, databaseConnectionManager)', () => {
    it('registers permissions', () => {
      // Arrange
      sandbox.on(modulesManager, 'registerPermissions');

      // Act
      unitUnderTest.build(modulesManager, databaseConnectionManager);

      // Assert
      expect(modulesManager.registerPermissions).to.have.been.called()
        .with.exactly(permissionsManager);
    });

    it('locks permissionsManager to further modifications', () => {
      // Arrange
      sandbox.on(permissionsManager, 'lock');

      // Act
      unitUnderTest.build(modulesManager, databaseConnectionManager);

      // Assert
      expect(permissionsManager.lock).to.have.been.called();
    });

    it('initializes modules', () => {
      // Arrange
      sandbox.on(modulesManager, 'initializeModules');

      // Act
      unitUnderTest.build(modulesManager, databaseConnectionManager);

      // Assert
      expect(modulesManager.initializeModules).to.have.been.called
        .with(databaseConnectionManager);
    });

    it('builds webApplication', () => {
      // Arrange
      sandbox.on(unitUnderTest, 'buildWebApplication');

      // Act
      unitUnderTest.build(modulesManager, databaseConnectionManager);

      // Assert
      expect(unitUnderTest.buildWebApplication).to.have.been.called
        .with(modulesManager);
    });

    it('returns instance of Application', () => {
      // Act
      const result = unitUnderTest.build(modulesManager, databaseConnectionManager);

      // Assert
      expect(result).to.be.an.instanceOf(Application);
    });
  });
});
