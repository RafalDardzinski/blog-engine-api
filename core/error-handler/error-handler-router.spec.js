// Global imports
const chai = require('chai');

// Local imports
const Response = require('./response');
const IErrorHandler = require('./error-handler');
const ErrorHandlerRouter = require('./error-handler-router');

// Mocks
class ErrorHandlerMock extends IErrorHandler {
  canHandle() {
    return false;
  }

  handle() {}
}

// Test suite setup
const { expect } = chai;

describe(`ErrorHandlerRouter ${__dirname}`, () => {
  let errorHandlers;
  /** @type {ErrorHandlerRouter} */
  let unitUnderTest;

  beforeEach(() => {
    errorHandlers = [new ErrorHandlerMock(), new ErrorHandlerMock(), new ErrorHandlerMock()];
    unitUnderTest = new ErrorHandlerRouter(errorHandlers);
  });

  describe('constructor(errorHandlers)', () => {
    it('does not reveal errorHandlers', () => {
      // Act
      const publicProps = Object.values(unitUnderTest);

      // Assert
      expect(publicProps).to.not.include(errorHandlers);
    });
  });

  describe('ErrorHandlerRouter#handleError(error)', () => {
    it('returns an instance of Response', () => {
      // Arrange
      const error = new Error();

      // Act
      const result = unitUnderTest.handleError(error);

      // Assert
      expect(result).to.be.an.instanceOf(Response);
    });

    it('handles error using error handler that can handle it', () => {
      // Arrange
      const response = new Response();
      const ableHandler = errorHandlers[1];
      ableHandler.canHandle = () => true;
      ableHandler.handle = () => response;

      // Act
      const result = unitUnderTest.handleError(new Error());

      // Assert
      expect(result).to.equal(response);
    });

    describe('when it does not have a proper errorHandler... ', () => {
      it('returns a generic response', () => {
        // Arrange
        const error = new Error('Test');

        // Act
        const result = unitUnderTest.handleError(error);

        // Assert
        expect(result.httpCode).to.equal(500, 'Generic response must have response code of 500.');
        expect(result.originalError).to.equal(error, 'Original error must be saved.');
        expect(result.message).to.not.equal(error.message, 'Response message must not be the same as original error\'s message.');
      });
    });
  });
});
