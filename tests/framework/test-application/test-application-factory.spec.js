// Global imports
const chai = require('chai');
const spies = require('chai-spies');

// Local imports
const { DatabaseConnectionManager } = require('../../../core/database');
const Application = require('../../../core/application/application');
const TestApplicationFactory = require('./test-application-factory');

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

class DatabaseConnectionManagerMock extends DatabaseConnectionManager {
  constructor() {
    super(() => null, {});
  }
}

class ApplicationComponentsMock {
  setApplicationName() {}
}

// Test suite setup
chai.use(spies);
const sandbox = chai.spy.sandbox();
const { expect } = chai;

describe(`TestApplicationFactory ${__dirname}`, () => {
  let coreModules;
  let webApplicationBuilder;
  let permissionsManager;
  let applicationModulesManager;

  /** @type {TestApplicationFactory} */
  let unitUnderTest;

  beforeEach(() => {
    coreModules = {};
    webApplicationBuilder = new WebApplicationBuilderMock();
    permissionsManager = new PermissionsManagerMock();
    applicationModulesManager = new ApplicationModulesManagerMock();

    unitUnderTest = new TestApplicationFactory(
      coreModules,
      webApplicationBuilder,
      permissionsManager,
      applicationModulesManager,
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('TestApplicationFactory#setApplicationComponents(applicationComponents)', () => {
    it('assigns applicationComponents to TestApplicationFactory#applicationComponents', () => {
      // Arrange
      const applicationComponents = new ApplicationComponentsMock();

      // Act
      unitUnderTest.setApplicationComponents(applicationComponents);

      // Assert
      expect(unitUnderTest.applicationComponents).to.be.equal(applicationComponents);
    });
  });

  describe('TestApplicationFactory#create(applicationModules, databaseConnectionManager)', () => {
    it('sets applicationName on application components', () => {
      // Arrange
      const databaseConnectionManager = new DatabaseConnectionManagerMock();
      const applicationComponents = new ApplicationComponentsMock();
      sandbox.on(applicationComponents, 'setApplicationName');
      unitUnderTest.setApplicationComponents(applicationComponents);

      // Act
      unitUnderTest.create({}, databaseConnectionManager);

      // Assert
      expect(applicationComponents.setApplicationName).to.have.been.called();
    });

    it('returns instance of application', () => {
      // Arrange
      const databaseConnectionManager = new DatabaseConnectionManagerMock();
      const applicationComponents = new ApplicationComponentsMock();
      unitUnderTest.setApplicationComponents(applicationComponents);

      // Act
      const result = unitUnderTest.create({}, databaseConnectionManager);

      // Assert
      expect(result).to.be.an.instanceOf(Application);
    });
  });
});
