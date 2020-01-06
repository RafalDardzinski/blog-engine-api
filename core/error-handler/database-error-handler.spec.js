// Global imports
const chai = require('chai');
const { Error: MongooseError } = require('mongoose');

// Local imports
const DatabaseErrorHandler = require('./database-error-handler');

// Mocks
class MongoErrorMock extends Error {
  constructor(message) {
    super(message);
    this.name = 'MongoError';
  }
}

class UniqueIndexErrorMock extends MongoErrorMock {
  constructor(message) {
    super(message);
    this.code = 11000;
    this.keyValue = {};
  }
}

class MongooseErrorMock extends MongooseError {}

class ValidationErrorMock extends MongooseError.ValidationError {}

class CastErrorMock extends MongooseError.CastError {}

// Test suite setup
const { expect } = chai;

describe(`DatabaseErrorHandler ${__dirname}`, () => {
  /** @type {DatabaseErrorHandler} */
  let unitUnderTest;

  beforeEach(() => {
    unitUnderTest = new DatabaseErrorHandler();
  });

  describe('DatabaseErrorHandler#canHandle(error)', () => {
    describe('when error is instance of MongooseError...', () => {
      it('returns true', () => {
        // Arrange
        const error = new MongooseErrorMock('test');

        // Act
        const result = unitUnderTest.canHandle(error);

        // Assert
        expect(result).to.equal(true);
      });
    });

    describe('when error.name equals "MongoError"...', () => {
      it('returns true', () => {
        // Arrange
        const error = new MongoErrorMock('test');

        // Act
        const result = unitUnderTest.canHandle(error);

        // Assert
        expect(result).to.equal(true);
      });
    });

    describe('when error is not of a supported type...', () => {
      it('returns false', () => {
        // Arrange
        const error = new Error('test');

        // Act
        const result = unitUnderTest.canHandle(error);

        // Assert
        expect(result).to.equal(false);
      });
    });
  });

  describe('DatabaseErrorHandler.handle(error)', () => {
    describe('when error is instance of MongooseError.ValidationError...', () => {
      it('returns result from DatabaseErrorHandler#handleValidationError(error)', () => {
        // Arrange
        const error = new ValidationErrorMock({});
        const expectedResponse = unitUnderTest.handleValidationError(error);

        // Act
        const result = unitUnderTest.handle(error);

        // Assert
        expect(result).to.deep.equal(expectedResponse);
      });
    });

    describe('when error is a UniqueIndexError...', () => {
      it('returns result from DatabaseErrorHandler#handleUniqueIndexError(error)', () => {
        // Arrange
        const error = new UniqueIndexErrorMock('test');

        const expectedResponse = unitUnderTest.handleUniqueIndexError(error);

        // Act
        const result = unitUnderTest.handle(error);

        // Assert
        expect(result).to.deep.equal(expectedResponse);
      });
    });

    describe('when error is a CastError...', () => {
      it('returns result from DatabaseErrorHandler#handleCastError(error)', () => {
        // Arrange
        const error = new CastErrorMock('test');

        const expectedResponse = unitUnderTest.handleCastError(error);

        // Act
        const result = unitUnderTest.handle(error);

        // Assert
        expect(result).to.deep.equal(expectedResponse);
      });
    });

    describe('when error is not supported...', () => {
      it('returns null', () => {
        // Arrange
        const error = new Error('test');

        // Act
        const result = unitUnderTest.handle(error);

        // Assert
        expect(result).to.deep.equal(null);
      });
    });
  });

  describe('DatabaseErrorHandler#handleValidationError(error)', () => {
    it('returns a valid response', () => {
      // Arrange
      const error = new ValidationErrorMock({});

      // Act
      const result = unitUnderTest.handleValidationError(error);

      // Assert
      expect(result.httpCode).to.equal(400, 'Http code does not equal 400.');
      expect(result.message.length).to.be.greaterThan(0, 'Response message is not provided.');
      expect(result.originalError).to.equal(error, 'Reference to original error does not equal the error passed to the method.');
    });
  });

  describe('DatabaseErrorHandler#handleUniqueIndexError(error)', () => {
    it('returns a valid reponse', () => {
      // Arrange
      const error = new UniqueIndexErrorMock();

      // Act
      const result = unitUnderTest.handleUniqueIndexError(error);

      // Assert
      expect(result.httpCode).to.equal(400, 'Http code does not equal 400.');
      expect(result.message.length).to.be.greaterThan(0, 'Response message is not provided.');
      expect(result.originalError).to.equal(error, 'Reference to original error does not equal the error passed to the method.');
    });
  });

  describe('DatabaseErrorHandler#handleCastError(error)', () => {
    it('returns a valid reponse', () => {
      // Arrange
      const error = new MongooseError('test');

      // Act
      const result = unitUnderTest.handleCastError(error);

      // Assert
      expect(result.httpCode).to.equal(400, 'Http code does not equal 400.');
      expect(result.message.length).to.be.greaterThan(0, 'Response message is not provided.');
      expect(result.originalError).to.equal(error, 'Reference to original error does not equal the error passed to the method.');
    });
  });
});
