// Global imports
const chai = require('chai');
const spies = require('chai-spies');

// Local imports
const Controller = require('./controller');
const Route = require('./route');
const { InvalidOperationError } = require('../error');

// Test suite setup
chai.use(spies);
const sandbox = chai.spy.sandbox();
const { expect } = chai;

describe(`Controller ${__dirname}`, () => {
  const mountPath = 'testMountPath';
  let unitUnderTest;

  beforeEach(() => {
    unitUnderTest = new Controller(mountPath);
  });

  describe('constructor(mountPath)', () => {
    it('assigns mountPath to Controller#mountPath', () => {
      // Assert
      expect(unitUnderTest.mountPath).to.equal(mountPath);
    });

    it('assigns null to Controller#routes', () => {
      // Assert
      expect(unitUnderTest).to.have.property('routes')
        .that.equals(null);
    });
  });

  describe('Controller#hasRoutes', () => {
    describe('when Controller#routes is not an array...', () => {
      it('returns false', () => {
        // Arrange + Act
        unitUnderTest.routes = null;

        // Assert
        expect(unitUnderTest.hasRoutes).to.equal(false);
      });
    });

    describe('when Controller#routes is an empty array...', () => {
      it('returns false', () => {
        // Arrange + Act
        unitUnderTest.routes = [];

        // Assert
        expect(unitUnderTest.hasRoutes).to.equal(false);
      });
    });

    describe('when Controller#routes contains values...', () => {
      it('returns true', () => {
        // Arrange + Act
        unitUnderTest.routes = [{}];

        // Assert
        expect(unitUnderTest.hasRoutes).to.equal(true);
      });
    });
  });

  describe('registerRoutes(routes)', () => {
    describe('when routes is not an array...', () => {
      it('throws InvalidOperationError', () => {
        // Arrange
        const routes = {};

        // Act
        const act = () => unitUnderTest.registerRoutes(routes);

        // Assert
        expect(act).to.throw(InvalidOperationError);
      });
    });

    describe('when routes is an empty array...', () => {
      it('throws InvalidOperationError', () => {
        // Arrange
        const routes = [];

        // Act
        const act = () => unitUnderTest.registerRoutes(routes);

        // Assert
        expect(act).to.throw(InvalidOperationError);
      });
    });

    it('sets each routes context to current instance of controller', () => {
      // Arrange
      const route1 = new Route('get', 'test1', () => null);
      const route2 = new Route('get', 'test2', () => null);
      const routes = [route1, route2];
      routes.forEach(r => sandbox.on(r, 'setContext'));

      // Act
      unitUnderTest.registerRoutes(routes);

      // Assert
      routes.forEach((route) => {
        expect(route.setContext).to.have.been.called.with(unitUnderTest);
      });

      // Cleanup
      sandbox.restore();
    });

    it('adds each route to Controller#routes', () => {
      // Arrange
      const route1 = new Route('get', 'test1', () => null);
      const route2 = new Route('get', 'test2', () => null);
      const routes = [route1, route2];

      // Act
      unitUnderTest.registerRoutes(routes);

      // Assert
      routes.forEach((route) => {
        expect(unitUnderTest.routes).to.contain(route);
      });
    });
  });

  describe('Controller#validateSelf()', () => {
    describe('when controller does not have routes registered', () => {
      it('throws InvalidOperationError', () => {
        // Arrange
        unitUnderTest.routes = [];

        // Act
        const act = () => unitUnderTest.validateSelf();

        // Assert
        expect(act).to.throw(InvalidOperationError);
      });
    });

    describe('when Controller#routes contains object that is not an instance of Router class...', () => {
      it('throws InvalidOperationError', () => {
        // Arrange
        const validRoute = new Route('get', 'test1', () => null);
        const invalidRoute = { setContext: () => null };
        unitUnderTest.routes = [validRoute, invalidRoute];

        // Act
        const act = () => unitUnderTest.validateSelf();

        // Assert
        expect(act).to.throw(InvalidOperationError);
      });
    });
  });
});
