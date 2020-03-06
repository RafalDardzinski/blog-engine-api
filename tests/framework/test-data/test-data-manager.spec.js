// Global imports
const chai = require('chai');
const spies = require('chai-spies');

// Local imports
const { Engine: { InvalidOperationError } } = require('../../../core/error');
const TestDataManager = require('./test-data-manager');

// Mocks
class EntitiesInjectorMock {
  inject() {}

  cleanup() {}
}

class ConnectionMock {
  constructor() {
    this.db = null;
  }
}

class DatabaseMock {
  dropDatabase() {
    return Promise.resolve();
  }
}

// Test suite setup
chai.use(spies);
const sandbox = chai.spy.sandbox();
const { expect } = chai;

describe(`TestDataManager ${__dirname}`, () => {
  let entitiesInjector;

  /** @type { TestDataManager } */
  let unitUnderTest;

  beforeEach(() => {
    entitiesInjector = new EntitiesInjectorMock();
    unitUnderTest = new TestDataManager(entitiesInjector);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor(entitiesInjector)', () => {
    it('does not reveal entitiesInjector', () => {
      // Arrange + Act
      const publicProps = Object.values(unitUnderTest);

      // Assert
      expect(publicProps).to.not.include(entitiesInjector);
    });
  });

  describe('TestDataManager#isInitialized', () => {
    it('returns true when TestDataManager#initialize() was successfully called', () => {
      // Arrange
      const connection = new ConnectionMock();
      connection.db = new DatabaseMock();
      unitUnderTest.initialize(connection);

      // Act
      const result = unitUnderTest.isInitialized;

      // Assert
      expect(result).to.equal(true);
    });

    it('returns false when TestDataManager#initialize() wasn\'t called', () => {
      // Act
      const result = unitUnderTest.isInitialized;

      // Assert
      expect(result).to.equal(false);
    });
  });

  describe('TestDataManager#initialize(connection)', () => {
    it('cleans up database on provided connection', () => {
      // Arrange
      const connection = new ConnectionMock();
      const database = new DatabaseMock();
      sandbox.on(database, 'dropDatabase');
      connection.db = database;

      // Act
      unitUnderTest.initialize(connection);

      // Assert
      expect(database.dropDatabase).to.have.been.called();
    });

    describe('when TestDataManager#isInitialized is true...', () => {
      it('throws InvalidOperationError', async () => {
        // Arrange
        const connection = new ConnectionMock();
        const database = new DatabaseMock();
        sandbox.on(database, 'dropDatabase');
        connection.db = database;
        await unitUnderTest.initialize(connection);

        // Act
        const act = () => unitUnderTest.initialize(connection);

        // Assert
        expect(act).to.throw(InvalidOperationError);
      });
    });
  });

  describe('TestDataManager#injectTestData(testData)', () => {
    it('injects test data to the database using provided', () => {
      // Arrange
      const database = new DatabaseMock();
      const connection = new ConnectionMock();
      connection.db = database;
      const testData = {};

      sandbox.on(entitiesInjector, 'inject');
      unitUnderTest.initialize(connection);

      // Act
      unitUnderTest.injectTestData(testData);

      // Assert
      expect(entitiesInjector.inject).to.have.been.called
        .with.exactly(testData, connection);
    });

    describe('when TestDataManager was not initialized...', () => {
      it('throws InvalidOperationError', () => {
      // Arrange
        const testData = {};

        // Act
        const act = () => unitUnderTest.injectTestData(testData);

        // Assert
        expect(act).to.throw(InvalidOperationError);
      });
    });
  });

  describe('TestDataManager#removeInjectedTestData()', () => {
    it('cleans up previously injected test data', () => {
      // Arrange
      const database = new DatabaseMock();
      const connection = new ConnectionMock();
      connection.db = database;

      sandbox.on(entitiesInjector, 'cleanup');
      unitUnderTest.initialize(connection);

      // Act
      unitUnderTest.removeInjectedTestData();

      // Assert
      expect(entitiesInjector.cleanup).to.have.been.called();
    });

    describe('when TestDataManager was not initialized...', () => {
      it('throws InvalidOperationError', () => {
        // Act
        const act = () => unitUnderTest.removeInjectedTestData();

        // Assert
        expect(act).to.throw(InvalidOperationError);
      });
    });
  });
});
