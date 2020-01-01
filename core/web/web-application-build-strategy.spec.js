// Global imports
const chai = require('chai');
const spies = require('chai-spies');

// Local imports
const WebApplicationBuildStrategy = require('./web-application-build-strategy');

// Mocks
class ErrorHandlingMiddlewareMock {
  handler() { return true; }
}

// Test suite setup
chai.use(spies);
const { expect } = chai;

describe(`WebApplicationBuildStrategy ${__dirname}`, () => {
  const middleware = () => null;
  const defaultMiddleware = [middleware];

  let errorHandlingMiddleware;

  /** @type {WebApplicationBuildStrategy} */
  let unitUnderTest;

  beforeEach(() => {
    errorHandlingMiddleware = new ErrorHandlingMiddlewareMock();
    unitUnderTest = new WebApplicationBuildStrategy(defaultMiddleware, errorHandlingMiddleware);
  });

  describe('constructor(defaultMiddleware, errorHandlingMiddleware)', () => {
    it('assigns defaultMiddleware to WebApplicationBuildStrategy#defaultMiddleware', () => {
      // Assert
      expect(unitUnderTest.defaultMiddleware).to.equal(defaultMiddleware);
    });

    it('assigns errorHandlingMiddleware to WebApplicationBuildStratedy#errorHandlingMiddleware', () => {
      // Assert
      expect(unitUnderTest.errorHandlingMiddleware).to.equal(errorHandlingMiddleware);
    });
  });

  describe('WebApplicationBuildStrategy#applyDefaultMiddleware(webApp)', () => {
    it('calls webApp.use(defaultMiddleware) for each WebApplicationBuildStrategy#defaultMiddleware', () => {
      // Arrange
      const middleware2 = () => null;
      unitUnderTest.defaultMiddleware.push(middleware2);
      const webAppMock = () => null;
      webAppMock.use = chai.spy(() => null);

      // Act
      unitUnderTest.applyDefaultMiddleware(webAppMock);

      // Assert
      unitUnderTest.defaultMiddleware.forEach((m) => {
        expect(webAppMock.use).to.have.been.called.with.exactly(m);
      });
    });
  });

  describe('WebApplicationBuildStrategy#applyErrorHandler(webApp)', () => {
    it('applies errorHandlingMiddleware handler to web application', () => {
      // Arrange
      const webAppMock = () => null;
      const boundErrorHandlingMiddlewareHandler = errorHandlingMiddleware.handler;
      unitUnderTest.errorHandlingMiddleware.handler.bind = () => errorHandlingMiddleware.handler;
      webAppMock.use = chai.spy(() => null);

      // Act
      unitUnderTest.applyErrorHandler(webAppMock);

      // Assert
      expect(webAppMock.use).to.have.been.called
        .with.exactly(boundErrorHandlingMiddlewareHandler);
    });
  });
});
