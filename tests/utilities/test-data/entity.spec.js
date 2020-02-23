// Global imports
const { ObjectId } = require('mongoose').Types;
const chai = require('chai');
const spies = require('chai-spies');

// Local imports
const Entity = require('./entity');

// Test suite setup
chai.use(spies);
const { expect } = chai;

describe(`Entity ${__dirname}`, () => {
  const modelName = 'testModel';

  /** @type { Entity } */
  let unitUnderTest;

  beforeEach(() => {
    unitUnderTest = new Entity(modelName);
  });

  describe('constructor(modelName)', () => {
    it('assigns modelName to Entity#modelName', () => {
      // Assert
      expect(unitUnderTest.modelName).to.equal(modelName);
    });

    it('sets modelName as readonly property', () => {
      // Arrange
      const oldValue = unitUnderTest.modelName;

      // Act
      unitUnderTest.modelName = 'newValue';

      // Assert
      expect(unitUnderTest.modelName).to.equal(oldValue);
    });

    it('assigns random id to Entity#_id', () => {
      // Assert
      expect(unitUnderTest._id).to.be.an.instanceOf(ObjectId);
    });
  });
});
