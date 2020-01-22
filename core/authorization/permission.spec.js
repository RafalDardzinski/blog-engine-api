// Global imports
const chai = require('chai');

// Local imports
const Permission = require('./permission');
const { Engine: { InvalidOperationError } } = require('../error');

// Test suite setup
const { expect } = chai;

describe(`Permission ${__dirname}`, () => {
  const name = 'test_name';
  const description = 'test_description';

  /** @type {Permission} */
  let unitUnderTest;

  beforeEach(() => {
    unitUnderTest = new Permission(name, description);
  });

  describe('constructor(name, description)', () => {
    it('assigns name to Permission#name', () => {
      expect(unitUnderTest.name).to.equal(name);
    });

    it('assigns description to Permission#description', () => {
      expect(unitUnderTest.descritpion).to.equal(description);
    });

    describe('throws InvalidOperationError when...', () => {
      it('name is not a string', () => {
        // Arrange
        const invalidNameValues = [
          undefined,
          null,
          {},
          [],
          555,
        ];

        // Act
        const acts = invalidNameValues.map(val => ({
          func: () => new Permission(val, description),
          value: val,
        }));

        // Assert
        acts.forEach((act) => {
          expect(act.func).to.throw(InvalidOperationError, '', `Passing '${act.value}' as name parameter did not throw an error.`);
        });
      });

      it('name is an empty string', () => {
        // Arrange + Act
        const act = () => new Permission('', description);

        // Assert
        expect(act).to.throw(InvalidOperationError);
      });
    });
  });

  describe('Permission#name', () => {
    it('cannot be reassigned', () => {
      // Arrange
      const oldValue = unitUnderTest.name;

      // Act
      unitUnderTest.name = 'different_value';

      // Assert
      expect(unitUnderTest.name).to.equal(oldValue);
    });
  });

  describe('Permission#description', () => {
    it('cannot be reassigned', () => {
      // Arrange
      const oldValue = unitUnderTest.descritpion;

      // Act
      unitUnderTest.descritpion = 'different_value';

      // Assert
      expect(unitUnderTest.descritpion).to.equal(oldValue);
    });
  });
});
