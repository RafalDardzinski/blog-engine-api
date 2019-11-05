// Global imports
const chai = require('chai');
const spies = require('chai-spies');

// Local imports
const Model = require('./model');
const { InvalidOperationError } = require('../error');

// Mocks
class ConnectionManagerMock {
  registerModel() {}
}

// Test suite setup
chai.use(spies);
const sandbox = chai.spy.sandbox();
const { expect } = chai;

describe(`Model ${__dirname}`, () => {
  const name = 'testName';
  const schema = {};
  let connectionManager;

  /** @type {Model} */
  let unitUnderTest;

  beforeEach(() => {
    connectionManager = new ConnectionManagerMock();
    unitUnderTest = new Model(name, schema);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor(name, schema)', () => {
    it('assigns name to Model#name', () => {
      expect(unitUnderTest.name).to.equal(name);
    });

    it('assigns schema to Model#schema', () => {
      expect(unitUnderTest.schema).to.equal(schema);
    });
  });

  describe('Model#isRegistered', () => {
    describe('when model is registered', () => {
      it('returns true', () => {
        // Arrange
        unitUnderTest.registerSelf(connectionManager);

        // Act
        const result = unitUnderTest.isRegistered;

        // Assert
        expect(result).to.equal(true);
      });
    });

    describe('when model is not registered', () => {
      it('returns false', () => {
        // Act
        const result = unitUnderTest.isRegistered;

        // Assert
        expect(result).to.equal(false);
      });
    });
  });

  describe('Model#registerSelf(connectionManager)', () => {
    it('registers Model instance on connectionManager', () => {
      // Arrange
      sandbox.on(connectionManager, 'registerModel');

      // Act
      unitUnderTest.registerSelf(connectionManager);

      // Assert
      expect(connectionManager.registerModel).to.have.been.called
        .with(unitUnderTest);
    });

    it('sets Model#isRegistered to true', () => {
      // Act
      unitUnderTest.registerSelf(connectionManager);
      const { isRegistered } = unitUnderTest;

      // Assert
      expect(isRegistered).to.equal(true);
    });

    describe('when Model#isRegistered is true', () => {
      it('throws InvalidOperationError', () => {
        // Arrange
        unitUnderTest.registerSelf(connectionManager);

        // Act
        const act = () => unitUnderTest.registerSelf(connectionManager);

        // Assert
        expect(act).to.throw(InvalidOperationError);
      });
    });
  });

  describe('Model#query()', () => {
    it('returns result of model registration within connectionManager', () => {
      // Arrange
      const registrationResult = {};
      connectionManager.registerModel = () => registrationResult;
      unitUnderTest.registerSelf(connectionManager);

      // Act
      const result = unitUnderTest.query();

      // Assert
      expect(result).to.equal(registrationResult);
    });
    describe('when model is not registerd', () => {
      it('throws InvalidOperationError', () => {
        // Act
        const act = () => unitUnderTest.query();

        // Assert
        expect(act).to.throw(InvalidOperationError);
      });
    });
  });
});
