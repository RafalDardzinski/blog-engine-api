// Global imports
const chai = require('chai');
const spies = require('chai-spies');

// Local imports
const Controller = require('./controller');
const { InvalidOperationError } = require('../error/core');

// Mocks
class HandlerFactory {
  static create() {
    return function testHandler() { return true; };
  }
}

// Test suite setup
chai.use(spies);
const sandbox = chai.spy.sandbox();
const { expect } = chai;

describe(`Controller ${__dirname}`, () => {
  const mountPath = '/testMountPath';

  /** @type {Controller} */
  let unitUnderTest;

  beforeEach(() => {
    unitUnderTest = new Controller(mountPath);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor(mountPath)', () => {
    it('assigns mountPath to Controller#mountPath', () => {
      // Assert
      expect(unitUnderTest.mountPath).to.equal(mountPath);
    });

    it('assigns empty map to Controller#registeredRoutes', () => {
      // Assert
      expect(unitUnderTest).to.have.property('registeredRoutes')
        .that.deep.equals(new Map());
    });
  });

  describe('Controller#hasRoutes', () => {
    describe('when Controller#registeredRoutes.size is greater than 0...', () => {
      it('returns true', () => {
        // Arrange
        const testHandler = HandlerFactory.create();
        unitUnderTest.registerRoute('GET', '/test', testHandler);

        // Act
        const result = unitUnderTest.hasRoutes;

        // Assert
        expect(result).to.equal(true);
      });
    });

    describe('when Controller#registeredRoutes.size is 0...', () => {
      it('returns false', () => {
        // Act
        const result = unitUnderTest.hasRoutes;

        // Assert
        expect(result).to.equal(false);
      });
    });
  });

  describe('registerRoute(method, mountPath, handler)', () => {
    it('registers route with provided data', () => {
      // Arrange
      const testHandler = HandlerFactory.create();
      const method = 'GET';
      const path = '/test';
      const handlerName = testHandler.name;

      // Act
      const result = unitUnderTest.registerRoute(method, path, testHandler);

      // Assert
      expect(result.path).to.equal(path);
      expect(result.method).to.equal(method);
      expect(unitUnderTest.registeredRoutes.get(handlerName)).to.equal(result);
    });

    it('sets context of created route\'s handler to controller', () => {
      // Arrange
      const method = 'GET';
      const path = '/test';
      const testHandler = HandlerFactory.create();
      sandbox.on(testHandler, 'bind');

      // Act
      unitUnderTest.registerRoute(method, path, testHandler);

      // Assert
      expect(testHandler.bind).to.have.been.called
        .with.exactly(unitUnderTest);
    });
  });

  describe('Controller#validateSelf()', () => {
    describe('when controller does not have routes registered', () => {
      it('throws InvalidOperationError', () => {
        // Act
        const act = () => unitUnderTest.validateSelf();

        // Assert
        expect(act).to.throw(InvalidOperationError);
      });
    });
  });
});
