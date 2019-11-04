// Global imports
const chai = require('chai');
const spies = require('chai-spies');

// Local imports
const Repository = require('./repository');

// Mocks
class ModelMock {
  registerSelf() {}
}

class DatabaseConnectionManagerMock {
  registerModel() {}
}

// Test suite setup
chai.use(spies);
const sandbox = chai.spy.sandbox();
const { expect } = chai;

describe(`Repository ${__dirname}`, () => {
  let model;
  let concreteRepositoryModelProperty;
  let databaseConnectionManager;

  /** @type {Repository} */
  let unitUnderTest;

  beforeEach(() => {
    model = new ModelMock();
    databaseConnectionManager = new DatabaseConnectionManagerMock();
    concreteRepositoryModelProperty = new WeakMap();
    unitUnderTest = new Repository(model, concreteRepositoryModelProperty);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor(model, concreteRepositoryModelProperty', () => {
    it('does not reveal model', () => {
      // Act
      const publicPropertiesValues = Object.values(unitUnderTest);

      // Assert
      expect(publicPropertiesValues).to.not.contain(model);
    });

    it('assigns model to concreteRepositoryModelProperty', () => {
      // Act
      const result = concreteRepositoryModelProperty.get(unitUnderTest);

      // Assert
      expect(result).to.equal(model);
    });

    it('allows using model in child classes by correctly passing its reference to defined property', () => {
      // Arrange
      const _privateProp = new WeakMap();
      class ConcreteRepository extends Repository {
        constructor() {
          super(model, _privateProp);
        }
      }
      unitUnderTest = new ConcreteRepository();

      // Act
      const result = _privateProp.get(unitUnderTest);

      // Assert
      expect(result).to.equal(model);
    });
  });

  describe('Repository#isInitialized', () => {
    it('is read only', () => {
      // Arrange
      const oldValue = unitUnderTest.isInitialized;

      // Act
      unitUnderTest.isInitialized = 'test';

      // Assert
      expect(unitUnderTest.isInitialized).to.equal(oldValue);
    });

    describe('when repository is initialized...', () => {
      it('returns true', () => {
        // Act
        unitUnderTest.registerConnection(databaseConnectionManager);

        // Assert
        expect(unitUnderTest.isInitialized).to.equal(true);
      });
    });

    describe('when repository is not initialized', () => {
      it('returns false', () => {
        // Assert
        expect(unitUnderTest.isInitialized).to.equal(false);
      });
    });
  });

  describe('Repository#registerConnection(connectionManager)', () => {
    it('registers model on connection', () => {
      // Arrange
      sandbox.on(model, 'registerSelf');

      // Act
      unitUnderTest.registerConnection(databaseConnectionManager);

      // Assert
      expect(model.registerSelf).to.have.been.called
        .with(databaseConnectionManager);
    });
  });
});
