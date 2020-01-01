// Global imports
const chai = require('chai');

// Local imports
const Response = require('./response');

// Test suite setup
const { expect } = chai;

describe(`Response ${__dirname}`, () => {
  const httpCode = 401;
  const message = 'test message';
  const originalErrorMessage = 'original error test message';

  let originalError;
  /** @type {Response} */
  let unitUnderTest;

  beforeEach(() => {
    originalError = new Error(originalErrorMessage);
    unitUnderTest = new Response(httpCode, message, originalError);
  });

  describe('constructor(httpCode, message, originalError)', () => {
    it('assigns httpCode to Response#httpCode', () => {
      expect(unitUnderTest.httpCode).to.equal(httpCode);
    });

    it('assigns message to Response#message', () => {
      expect(unitUnderTest.message).to.equal(message);
    });

    it('assigns originalError to Response#originalError', () => {
      expect(unitUnderTest.originalError).to.equal(originalError);
    });

    describe('when httpCode...', () => {
      describe('...is not a number...', () => {
        it('throws an error', () => {
          // Arrange
          const invalidHttpCode = 'bad_request';

          // Act
          const act = () => new Response(invalidHttpCode, message, originalError);

          // Assert
          expect(act).to.throw();
        });
      });
    });

    describe('when message...', () => {
      describe('...is not a string...', () => {
        it('throws an error', () => {
          // Arrange
          const invalidMessage = 123;

          // Act
          const act = () => new Response(httpCode, invalidMessage, originalError);

          // Assert
          expect(act).to.throw();
        });
      });

      describe('...is empty string...', () => {
        it('throws an error', () => {
          // Arrange
          const invalidMessage = '';

          // Act
          const act = () => new Response(httpCode, invalidMessage, originalError);

          // Assert
          expect(act).to.throw();
        });
      });
    });
  });

  describe('Response#originalError', () => {
    it('is read-only', () => {
      // Arrange
      const initialValue = unitUnderTest.originalError;

      // Act
      unitUnderTest.originalError = new Error();

      // Assert
      expect(unitUnderTest.originalError).to.equal(initialValue);
    });
  });
});
