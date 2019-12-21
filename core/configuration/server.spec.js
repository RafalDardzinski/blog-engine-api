// Global imports
const chai = require('chai');

// Local imports
const ServerConfiguration = require('./server');
const { InvalidOperationError } = require('../error/core');

// Test suite setup
const { expect } = chai;

describe(`ServerConfiguration ${__dirname}`, () => {
  const originalServerPort = process.env.SERVER_PORT;

  const unitUnderTest = new ServerConfiguration();

  afterEach(() => {
    process.env.SERVER_PORT = originalServerPort;
  });

  describe('ServerConfiguration.port', () => {
    it('returns value of SERVER_PORT environment variable', () => {
      // Arrange
      const expectedValue = 4684;
      process.env.SERVER_PORT = expectedValue;

      // Act
      const result = unitUnderTest.port;

      // Assert
      expect(result).to.equal(expectedValue);
    });

    it('cannot be reassigned', () => {
      // Arrange
      const expectedValue = 5548;
      process.env.SERVER_PORT = expectedValue;

      // Act
      unitUnderTest.port = () => 'incorrect';

      // Assert
      expect(unitUnderTest.port).to.equal(expectedValue);
    });

    describe('when SERVER_PORT is not defined...', () => {
      it('throws InvalidOperationError', () => {
        // Arrange
        process.env.SERVER_PORT = undefined;

        // Act
        const act = () => unitUnderTest.port;

        // Assert
        expect(act).to.throw(InvalidOperationError);
      });
    });

    describe('when SERVER_PORT is not a number', () => {
      it('throws InvalidOperationError', () => {
        // Arrange
        process.env.SERVER_PORT = 'incorrectValue';

        // Act
        const act = () => unitUnderTest.port;

        // Assert
        expect(act).to.throw(InvalidOperationError);
      });
    });
  });
});
