// Global imports
const chai = require('chai');
const spies = require('chai-spies');

// Local imports
const DatabaseConnectionManager = require('./connection-manager');
const Model = require('./model');
const { InvalidOperationError } = require('../error');

// Mocks
class ConnectionMock {
  constructor() {
    this.readyState = 0;
  }

  openUri() {
    return Promise.resolve();
  }

  close() {
    return Promise.resolve();
  }

  model() {
  }
}

class DatabaseConfigMock {
  static getUri() {
    return 'testuri';
  }
}

class ConnectionObserverMock {
  watch() {
  }
}

// Test suite setup
chai.use(spies);
const sandbox = chai.spy.sandbox();
const { expect } = chai;

describe(`DatabaseConnectionManager ${__dirname}`, () => {
  let connection;
  let connectionFactoryMethod;
  let connectionObserver;

  /** @type {DatabaseConnectionManager} */
  let unitUnderTest;

  beforeEach(() => {
    connection = new ConnectionMock();
    connectionFactoryMethod = () => connection;
    connectionObserver = new ConnectionObserverMock();
    unitUnderTest = new DatabaseConnectionManager(
      connectionFactoryMethod,
      DatabaseConfigMock,
      connectionObserver,
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor(connectionFactoryMethod, config, connectionObserver)', () => {
    it('does not reveal connectionFactoryMethod', () => {
      // Arrange
      const publicProps = Object.values(unitUnderTest);

      // Act + Assert
      expect(publicProps).to.not.contain(connectionFactoryMethod);
    });

    it('does not reveal config', () => {
      // Arrange
      const publicProps = Object.values(unitUnderTest);

      // Act + Assert
      expect(publicProps).to.not.contain(DatabaseConfigMock);
    });

    it('does not reveal connectionObserver', () => {
      // Arrange
      const publicProps = Object.values(unitUnderTest);

      // Act + Assert
      expect(publicProps).to.not.contain(connectionObserver);
    });

    describe('when connectionObserver is truthy', () => {
      it('calls connectionObserver.watch() on result of connectionFactory()', () => {
        // Arrange
        sandbox.on(connectionObserver, 'watch');

        // Act
        unitUnderTest = new DatabaseConnectionManager(connectionFactoryMethod,
          null,
          connectionObserver);

        // Assert
        expect(connectionObserver.watch).to.have.been.called();
      });
    });
  });

  describe('DatabaseConnectionManager#isConnected', () => {
    describe('when is connected to the database...', () => {
      it('returns true', () => {
        // Arrange
        connection.readyState = 1;

        // Act
        const result = unitUnderTest.isConnected;

        // Assert
        expect(result).to.equal(true);
      });
    });

    describe('when is not connected to the database...', () => {
      it('returns false', () => {
        // Act
        const result = unitUnderTest.isConnected;

        // Arrange
        expect(result).to.equal(false);
      });
    });
  });

  describe('DatabaseConnectionManager#connect(options)', () => {
    it('connects to the database using provided options and configuration', async () => {
      // Arrange
      const options = {
        useNewUrlParser: false,
        someProp: true,
      };
      const uri = DatabaseConfigMock.getUri();
      sandbox.on(connection, 'openUri');

      // Act
      await unitUnderTest.connect(options);

      // Assert
      expect(connection.openUri).to.have.been.called
        .with(uri, options);
    });

    describe('when options are not provided', () => {
      it('connects to the database using default options', async () => {
        // Arrange
        const defaultOptions = {
          useNewUrlParser: true,
        };
        const uri = DatabaseConfigMock.getUri();
        sandbox.on(connection, 'openUri');

        // Act
        await unitUnderTest.connect();

        // Assert
        expect(connection.openUri).to.have.been.called
          .with(uri, defaultOptions);
      });
    });

    describe('DatabaseConnectionManager#disconnect', () => {
      it('disconnects from the database', async () => {
        // Arrange
        sandbox.on(connection, 'close');

        // Act
        await unitUnderTest.disconnect();

        // Assert
        expect(connection.close).to.have.been.called();
      });
    });

    describe('DatabaseConnectionManager#registerModel(model)', () => {
      it('registers model on connection', () => {
        // Arrange
        const model = new Model('test', {});
        sandbox.on(connection, 'model');

        // Act
        unitUnderTest.registerModel(model);

        // Assert
        expect(connection.model).to.have.been.called
          .with.exactly(model.name, model.schema);
      });

      describe('when model is not an instance of Model class', () => {
        it('throws InvalidOperationError', () => {
          // Arrange
          const model = {};

          // Act
          const act = () => unitUnderTest.registerModel(model);

          // Assert
          expect(act).to.throw(InvalidOperationError);
        });
      });
    });
  });
});
