// Global imports
const chai = require('chai');
const spies = require('chai-spies');

// Local imports
const BusinessLogicErrorHandler = require('./business-logic-error-handler');
const Response = require('./response');
const BusinessLogicError = require('../error/business-logic/base');

// Mocks
class BusinessError extends BusinessLogicError {}

// Test suite setup
chai.use(spies);
const { expect } = chai;

describe(`BusinessLogicErrorHandler ${__dirname}`, () => {
  const errorMessage = 'testMessage';
  const errorHttpCode = 502;

  let businessError;
  let unitUnderTest;
  beforeEach(() => {
    businessError = new BusinessError(errorMessage, errorHttpCode);
    unitUnderTest = BusinessLogicErrorHandler;
  });

  describe('BusinessLogicErrorHandler.canHandle(error)', () => {
    describe('when error is BusinessLogic error...', () => {
      it('returns true', () => {
        // Arrange + Act
        const result = unitUnderTest.canHandle(businessError);

        // Assert
        expect(result).to.equal(true);
      });
    });

    describe('when error is not a BusinessLogic error...', () => {
      it('returns false', () => {
        // Arrange
        const testError = new Error();

        // Act
        const result = unitUnderTest.canHandle(testError);

        // Assert
        expect(result).to.equal(false);
      });
    });
  });

  describe('BusinessLogicErrorHandler.handle(error)', () => {
    it('returns instance of Reponse', () => {
      // Arrange + Act
      const result = unitUnderTest.handle(businessError);

      // Assert
      expect(result).to.be.an.instanceOf(Response);
    });

    it('returns Response that Reponse#httpCode equals error.correspondingHttpCode', () => {
      // Arrange + Act
      const result = unitUnderTest.handle(businessError);

      // Assert
      expect(result.httpCode).to.equal(errorHttpCode);
    });

    it('returns Response that Response#message equals error.message', () => {
      // Arrange + Act
      const result = unitUnderTest.handle(businessError);

      // Assert
      expect(result.message).to.equal(errorMessage);
    });

    it('returns Response that Response#stackTrace equals error.stack', () => {
      // Arrange + Act
      const result = unitUnderTest.handle(businessError);

      // Assert
      expect(result.stackTrace).to.equal(businessError.stack);
    });
  });
});
