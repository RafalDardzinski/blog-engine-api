// Global imports
const chai = require('chai');

// Local imports
const Hash = require('./hash');

// Test suite setup
const { expect } = chai;

describe(`Hash ${__dirname}`, () => {
  const hashValue = 'hashValue';
  const hashSalt = 'hashSalt';

  /** @type {Hash} */
  let unitUnderTest;

  beforeEach(() => {
    unitUnderTest = new Hash(hashValue, hashSalt);
  });

  describe('constructor(value, salt)', () => {
    it('assigns value to Hash#value', () => {
      // Assert
      expect(unitUnderTest.value).to.equal(hashValue);
    });

    it('assigns salt to Hash#salt', () => {
      // Assert
      expect(unitUnderTest.salt).to.equal(hashSalt);
    });

    describe('when value is falsy', () => {
      it('throws an error', () => {
        // Arrange + Act
        const act = () => new Hash(undefined, hashSalt);

        // Assert
        expect(act).to.throw();
      });
    });

    describe('when salt is falsy', () => {
      it('throws an error', () => {
        // Arrange + Act
        const act = () => new Hash(hashValue);

        // Assert
        expect(act).to.throw();
      });
    });
  });
});
