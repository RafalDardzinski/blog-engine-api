// Global imports
const chai = require('chai');
const spies = require('chai-spies');
const chaiAsPromised = require('chai-as-promised');

// Local imports
const Application = require('./application');

// Mocks
class WebApplication {

}

class DatabaseConnectionManager {
  connect() {
    return Promise.resolve();
  }

  disconnect() {
    return Promise.resolve();
  }
}

class Logger {
  info() {}

  error() {}
}

class Server {
  start() {
    return Promise.resolve();
  }
}

// Test suite setup
chai.use(spies);
chai.use(chaiAsPromised);
const sandbox = chai.spy.sandbox();
const { expect } = chai;

describe(`Application ${__dirname}`, () => {
  let webApplication;
  let databaseConnectionManager;
  let logger;
  let server;
  let unitUnderTest;

  beforeEach(() => {
    webApplication = new WebApplication();
    databaseConnectionManager = new DatabaseConnectionManager();
    logger = new Logger();
    server = new Server();
    unitUnderTest = new Application(webApplication, databaseConnectionManager, logger);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor(webApplication, databaseConnectionManager, logger)', () => {
    it('does not reveal webApplication', () => {
      // Act
      const publicProps = Object.values(unitUnderTest);

      // Assert
      expect(publicProps).to.not.include(webApplication);
    });

    it('does not reveal databaseConnectionManager', () => {
      // Act
      const publicProps = Object.values(unitUnderTest);

      // Assert
      expect(publicProps).to.not.include(databaseConnectionManager);
    });

    it('does not reveal logger', () => {
      // Act
      const publicProps = Object.values(unitUnderTest);

      // Assert
      expect(publicProps).to.not.include(logger);
    });
  });

  describe('Application#name', () => {
    it('returns application name and version', () => {
      // Arrange
      const appName = process.env.npm_package_name;
      const appVersion = process.env.npm_package_version;

      // Act
      const result = unitUnderTest.name;

      // Assert
      expect(result).to.contain(appName, 'Must contain application name');
      expect(result).to.contain(appVersion, 'Must contain application version');
    });
  });

  describe('Application#run(server)', () => {
    it('connects to the database', async () => {
      // Arrange
      sandbox.on(databaseConnectionManager, 'connect');

      // Act
      await unitUnderTest.run(server);

      // Assert
      expect(databaseConnectionManager.connect).to.have.been.called();
    });

    it('starts server using internal webApplication', async () => {
      // Arrange
      sandbox.on(server, 'start');

      // Act
      await unitUnderTest.run(server);

      // Assert
      expect(server.start).to.have.been.called
        .with(webApplication);
    });

    describe('when connecting to the database fails...', () => {
      it('logs an error from databaseConnectionManager', async () => {
        // Arrange
        sandbox.on(logger, 'error');
        const connectionError = new Error('connection failed');
        databaseConnectionManager.connect = () => Promise.reject(connectionError);

        // Act
        try {
          await unitUnderTest.run(server);
        } catch (error) {} // eslint-disable-line    

        // Assert
        expect(logger.error).to.have.been.called
          .with(connectionError.message);
      });

      it('throws an error from databaseConnectionManager', async () => {
        // Arrange
        const connectionError = new Error('connection failed');
        databaseConnectionManager.connect = () => Promise.reject(connectionError);

        // Act
        const act = () => unitUnderTest.run(server);

        // Assert
        expect(act()).to.be.rejectedWith(connectionError);
      });
    });

    describe('when starting server fails...', () => {
      it('closes database connection', async () => {
        // Arrange
        const serverError = new Error('starting server failed...');
        server.start = () => Promise.reject(serverError);
        databaseConnectionManager.isConnected = true;
        sandbox.on(databaseConnectionManager, 'disconnect');

        // Act
        try {
          await unitUnderTest.run(server);
        } catch (e) {} // eslint-disable-line

        // Assert
        expect(databaseConnectionManager.disconnect).to.have.been.called();
      });

      it('throws an error', () => {
        // Arrange
        const serverError = new Error('starting server failed...');
        server.start = () => Promise.reject(serverError);

        // Act
        const act = () => unitUnderTest.run(server);

        // Assert
        expect(act()).to.be.rejectedWith(serverError);
      });
    });
  });
});
