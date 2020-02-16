// Global imports
const chai = require('chai');
const spies = require('chai-spies');

// Local imports
const ApplicationInitializer = require('./application-initializer');

// Mocks
class DatabaseConnectionManagerMock {
  constructor(databaseConfigPrefix) {
    this.databaseConfigPrefix = databaseConfigPrefix;
  }
}

class ApplicationMock {
  constructor(modules, databaseConnectionManager) {
    this.modules = modules;
    this.databaseConnectionManager = databaseConnectionManager;
  }

  run() {}
}

class ServerMock {}

class DatabaseConnectionManagerFactoryMock {
  create() {}
}

class ApplicationFactoryMock {
  create() {
    return new ApplicationMock();
  }
}

class ServerFactoryMock {
  create() {}
}

// Test suite setup
chai.use(spies);
const sandbox = chai.spy.sandbox();
const { expect } = chai;

describe(`ApplicationInitializer ${__dirname}`, () => {
  let databaseConnectionManagerFactory;
  let applicationFactory;
  let serverFactory;

  /** @type {ApplicationInitializer} */
  let unitUnderTest;

  beforeEach(() => {
    databaseConnectionManagerFactory = new DatabaseConnectionManagerFactoryMock();
    applicationFactory = new ApplicationFactoryMock();
    serverFactory = new ServerFactoryMock();

    unitUnderTest = new ApplicationInitializer(
      databaseConnectionManagerFactory,
      applicationFactory,
      serverFactory,
    );
  });

  describe('constructor(databaseConnectionManagerFactory, applicationFactory, serverFactory)', () => {
    it('assigns databaseConnectionManagerFactory to ApplicationInitializer#databaseConnectionManagerFactory', () => {
      // Assert
      expect(unitUnderTest.databaseConnectionManagerFactory)
        .to.equal(databaseConnectionManagerFactory);
    });

    it('assigns applicationFactory to ApplicationInitializer#applicationFactory', () => {
      // Assert
      expect(unitUnderTest.applicationFactory).to.equal(applicationFactory);
    });

    it('assigns serverFactory to ApplicationInitializer#serverFactory', () => {
      // Assert
      expect(unitUnderTest.serverFactory).to.equal(serverFactory);
    });
  });

  describe('ApplicationInitializer#initialize(modules, databaseConfigPrefix)', () => {
    /**
     * Big UT since this is a bootstrapper class.
     */
    it('creates an application and runs it on a created server', () => {
      // Arrange
      const modules = {};
      const databaseConfigPrefix = 'testConfigPrefix';

      const databaseConnectionManager = new DatabaseConnectionManagerMock();
      databaseConnectionManagerFactory.create = (configPrefix) => {
        databaseConnectionManager.databaseConfigPrefix = configPrefix;
        return databaseConnectionManager;
      };

      const application = new ApplicationMock();
      applicationFactory.create = (appModules, dbConnectionManager) => {
        application.modules = appModules;
        application.databaseConnectionManager = dbConnectionManager;
        return application;
      };
      sandbox.on(application, 'run');

      const server = new ServerMock();
      serverFactory.create = () => server;

      // Act
      unitUnderTest.initialize(modules, databaseConfigPrefix);

      // Assert
      expect(databaseConnectionManager.databaseConfigPrefix)
        .to.equal(databaseConfigPrefix, 'Instance of DatabaseConnectionManager was not properly created.');

      expect(application.modules)
        .to.equal(modules, 'Instance of Application was not properly created. Missing modules.');

      expect(application.databaseConnectionManager)
        .to.equal(databaseConnectionManager, 'Instance of Application was not properly created. Missing databaseConnectionManager.');

      expect(application.run)
        .to.have.been.called
        .with.exactly(server);
    });

    /**
     * Ensures the previous test is valid (there are no multiple objects created by factories).
     */
    it('runs each factory method exactly once', () => {
      // Arrange
      const modules = {};
      const databaseConfigPrefix = 'testConfigPrefix';

      sandbox.on(databaseConnectionManagerFactory, 'create');
      sandbox.on(applicationFactory, 'create');
      sandbox.on(serverFactory, 'create');

      // Act
      unitUnderTest.initialize(modules, databaseConfigPrefix);

      // Assert
      expect(databaseConnectionManagerFactory.create).to.have.been.called.once();
      expect(applicationFactory.create).to.have.been.called.once();
      expect(serverFactory.create).to.have.been.called.once();
    });
  });
});
