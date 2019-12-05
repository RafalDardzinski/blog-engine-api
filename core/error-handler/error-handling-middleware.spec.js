// Global imports
const chai = require('chai');
const spies = require('chai-spies');

// Local imports
const { ENVIRONMENT_TYPES } = require('../generics');
const Response = require('./response');
const ErrorHandlingMiddleware = require('./error-handling-middleware');

// Mocks
class ErrorHandlerRouterMock {
  handleError() {
    return new Response(511, 'testMessage');
  }
}

class ErrorMock extends Error {}
class ReqMock {}
class ResMock {
  status() { return this; }

  json() { return this; }
}

class LoggerMock {
  error() {}
}
// Test suite setup
chai.use(spies);
const sandbox = chai.spy.sandbox();
const { expect } = chai;

describe(`ErrorHandlingMiddleware ${__dirname}`, () => {
  const originalEnv = process.env.NODE_ENV;
  let errorHandlerRouter;
  let logger;
  let error;
  let req;
  let res;

  /** @type {ErrorHandlingMiddleware} */
  let unitUnderTest;

  beforeEach(() => {
    errorHandlerRouter = new ErrorHandlerRouterMock();
    logger = new LoggerMock();
    error = new ErrorMock('test message');
    req = new ReqMock();
    res = new ResMock();
    unitUnderTest = new ErrorHandlingMiddleware(errorHandlerRouter, logger);
  });

  afterEach(() => {
    sandbox.restore();
    process.env.NODE_ENV = originalEnv;
  });

  describe('constructor(errorHandlerRouter, logger)', () => {
    it('does not reveal errorHandlerRouter', () => {
      // Act
      const publicProps = Object.values(unitUnderTest);

      // Assert
      expect(publicProps).to.not.include(errorHandlerRouter);
    });

    it('does not reveal logger', () => {
      // Act
      const publicProps = Object.values(unitUnderTest);

      // Assert
      expect(publicProps).to.not.include(logger);
    });
  });

  describe('ErrorHandlingMiddleware#handler(error, req, res, next)', () => {
    it('responds with http code provided by errorHandlerRouter', () => {
      // Arrange
      sandbox.on(res, 'status');
      const responseHttpCode = 202;
      errorHandlerRouter.handleError = () => new Response(responseHttpCode, 'testMessage');

      // Act
      unitUnderTest.handler(error, req, res);

      // Assert
      expect(res.status).to.have.been.called
        .with.exactly(responseHttpCode);
    });
    it('responds with message provided by errorHandlerRouter', () => {
      // Arrange
      const responseMessage = 'testMessage';
      const expectedResponse = { message: responseMessage };
      errorHandlerRouter.handleError = () => new Response(418, responseMessage);
      let responseContent;
      res.json = (arg) => {
        responseContent = arg;
      };
      sandbox.on(res, 'json');

      // Act
      unitUnderTest.handler(error, req, res);

      // Assert
      expect(res.json).to.have.been.called();
      expect(responseContent).to.be.an('object').that.deep.equals(expectedResponse, 'Middleware responded with incorrect body.');
    });

    describe('when not in test environment...', () => {
      it('logs error.message', () => {
        // Arrange
        process.env.NODE_ENV = 'custom';
        sandbox.on(logger, 'error');

        // Act
        unitUnderTest.handler(error, req, res);

        // Assert
        expect(logger.error).to.have.been.called
          .with.exactly(error.message);
      });
    });

    describe('when in development environment...', () => {
      it('logs error stack trace', () => {
        // Arrange
        process.env.NODE_ENV = ENVIRONMENT_TYPES.DEVELOPMENT;
        sandbox.on(logger, 'error');

        // Act
        unitUnderTest.handler(error, req, res);

        // Assert
        expect(logger.error).to.have.been.called
          .with.exactly(error.stack);
      });
    });
  });
});
