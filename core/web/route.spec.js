// Global imports
const chai = require('chai');
const spies = require('chai-spies');

// Local imports
const Route = require('./route');
const { HTTP_METHODS } = require('../generics');
const { InvalidOperationError } = require('../error');

// Test suite setup
chai.use(spies);
const sandbox = chai.spy.sandbox();
const { expect } = chai;

describe(`Route ${__dirname}`, () => {
  const method = HTTP_METHODS.GET;
  const path = '/test';
  const handler = async () => null;
  let unitUnderTest;

  beforeEach(() => {
    unitUnderTest = new Route(method, path, handler);
  });

  describe('contructor(method, path, handler)', () => {
    it('assigns method to Route#method', () => {
      // Assert
      expect(unitUnderTest.method).to.equal(method);
    });

    it('assigns path to Route#path', () => {
      // Assert
      expect(unitUnderTest.path).to.equal(path);
    });

    it('does not reveal handler as property', () => {
      // Assert
      expect(Object.values(unitUnderTest)).to.not.contain(handler);
    });
  });

  describe('Route#handler(req, res, next)', () => {
    it('calls original handler(req, res, next)', async () => {
      // Arrange
      const spy = chai.spy(handler);
      unitUnderTest = new Route(HTTP_METHODS.GET, '/', spy);
      const req = {};
      const res = {};
      const next = () => null;

      // Act
      await unitUnderTest.handler(req, res, next);

      // Assert
      expect(spy).to.have.been.called.with.exactly(req, res, next);
    });

    describe('when original handler throws an error...', () => {
      it('calls next(error)', async () => {
        // Arrange
        const error = new Error();
        const errorThrowingHandler = () => {
          throw error;
        };
        const next = chai.spy(() => null);
        unitUnderTest = new Route(HTTP_METHODS.GET, '/', errorThrowingHandler);

        // Act
        await unitUnderTest.handler(null, null, next);

        // Assert
        expect(next).to.have.been.called.with.exactly(error);
      });
    });
  });

  describe('Route#setContext(ctx)', () => {
    it('binds ctx to the original handler', () => {
      // Arrange
      const context = {};
      sandbox.on(handler, 'bind');

      // Act
      unitUnderTest.setContext(context);

      // Assert
      expect(handler.bind).to.have.been.called.with(context);
    });
  });

  describe('Route#validateSelf()', () => {
    describe('when Route#method is not supported...', () => {
      it('throws InvalidOperationError', () => {
        // Arrange
        const invalidMethod = 'invalidHttpMethod';
        const validMethods = Object.values(HTTP_METHODS);
        const act = () => unitUnderTest.validateSelf();

        // Act + Assert
        unitUnderTest.method = invalidMethod;
        expect(act, `Route cannot use method '${invalidMethod}'`).to.throw(InvalidOperationError);

        validMethods.forEach((m) => {
          unitUnderTest.method = m;
          expect(act, `Error should not be thrown with method ${m}`).to.not.throw();
        });
      });
    });
  });
});
