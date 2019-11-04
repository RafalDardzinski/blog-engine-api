// Global imports
const chai = require('chai');
const spies = require('chai-spies');

// Local imports
const WebApplicationBuilder = require('./web-application-builder');
const WebApplicationBuildStrategy = require('./web-application-build-strategy');
const Controller = require('./controller');
const Route = require('./route');
const { HTTP_METHODS } = require('../generics');

// Test suite setup
chai.use(spies);
const sandbox = chai.spy.sandbox();
const { expect } = chai;

// Mocks
class WebAppMock {
  use() {
    return null;
  }
}

class RouterMock {
  static create() {
    const router = new RouterMock();
    Object.values(HTTP_METHODS).forEach((method) => {
      router[method] = chai.spy(() => null);
    });
    return router;
  }
}

class ControllerMock extends Controller {
  constructor() {
    super('/test');
    this.routes = [];
  }

  validateSelf() {
    return true;
  }
}

// TODO: fix ut
class ModulesManagerMock {
  constructor() {
    this.controllers = [];
  }
}

class RouteMock extends Route {
  constructor(method, path, handler) {
    super(method, path, handler);
    this._handler = this._handler;
  }

  // Covering handler to always return same object for testing purposes.
  get handler() {
    return this._handler;
  }

  validateSelf() {
    return true;
  }
}

describe(`WebApplicationBuilder ${__dirname}`, () => {
  let webApp;
  let router;
  let webApplicationBuildStrategy;
  let controller;
  let modulesManager;
  let unitUnderTest;

  const appFactory = () => webApp;
  const routerFactory = () => router;

  beforeEach(() => {
    webApp = new WebAppMock();
    router = RouterMock.create();
    webApplicationBuildStrategy = new WebApplicationBuildStrategy([]);
    controller = new ControllerMock();
    modulesManager = new ModulesManagerMock();
    unitUnderTest = new WebApplicationBuilder(
      appFactory, routerFactory, webApplicationBuildStrategy,
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('contructor(appFactory, routerFactory, buildStrategy)', () => {
    it('assigns appFactory to WebApplicationBuilder#appFactory', () => {
      // Assert
      expect(unitUnderTest.appFactory).to.equal(appFactory);
    });

    it('assigns routerFactory to WebApplicationBuilder#routerFactory', () => {
      // Assert
      expect(unitUnderTest.routerFactory).to.equal(routerFactory);
    });

    it('assigns buildStrategy to WebApplicationBuilder#buildStrategy', () => {
      // Assert
      expect(unitUnderTest.buildStrategy).to.equal(webApplicationBuildStrategy);
    });
  });

  describe('WebApplicationBuilder#build(modulesManager)', () => {
    it('creates web app using WebApplicationBuilder#appFactory()', () => {
      // Arrange
      sandbox.on(unitUnderTest, 'appFactory');

      // Act
      unitUnderTest.build(modulesManager);

      // Assert
      expect(unitUnderTest.appFactory).to.have.been.called();
    });

    it('applies default middleware on web app using WebApplicationBuilder#buildStrategy()', () => {
      // Arrange
      sandbox.on(webApplicationBuildStrategy, 'applyDefaultMiddleware');

      // Act
      unitUnderTest.build(modulesManager);

      // Assert
      expect(webApplicationBuildStrategy.applyDefaultMiddleware).to.have.been.called
        .with.exactly(webApp);
    });

    it('registers controllers provided in components.controllers', () => {
      // Arrange
      sandbox.on(unitUnderTest, 'registerControllers');

      // Act
      unitUnderTest.build(modulesManager);

      // Assert
      expect(unitUnderTest.registerControllers).to.have.been.called
        .with.exactly(webApp, modulesManager.controllers);
    });

    it('returns web app', () => {
      // Act
      const result = unitUnderTest.build(modulesManager);

      // Assert
      expect(result).to.equal(webApp);
    });
  });

  describe('WebApplicationBuilder#createRouter(controller)', () => {
    it('validates controller', () => {
      // Arrange
      sandbox.on(controller, 'validateSelf');

      // Act
      unitUnderTest.createRouter(controller);

      // Assert
      expect(controller.validateSelf).to.have.been.called();
    });

    it('creates router using WebApplicationBuilder#routerFactory', () => {
      // Arrange
      sandbox.on(unitUnderTest, 'routerFactory');

      // Act
      unitUnderTest.createRouter(controller);

      // Assert
      expect(unitUnderTest.routerFactory).to.have.been.called();
    });

    it('validates each route in controller.routes to router', () => {
      // Arrange
      const route1 = new RouteMock(HTTP_METHODS.GET, 'test1', () => null);
      const route2 = new RouteMock(HTTP_METHODS.POST, 'test2', () => null);
      const routes = [route1, route2];
      routes.forEach((r) => {
        sandbox.on(r, 'validateSelf');
      });
      controller.routes = routes;

      // Act
      unitUnderTest.createRouter(controller);

      // Assert
      routes.forEach((r) => {
        expect(r.validateSelf).to.have.been.called();
      });
    });

    it('register each route to router', () => {
      // Arrange
      const route1 = new RouteMock(HTTP_METHODS.GET, 'test1', () => null);
      const route2 = new RouteMock(HTTP_METHODS.POST, 'test2', () => null);
      const routes = [route1, route2];
      controller = new ControllerMock();
      controller.routes = routes;

      // Act
      unitUnderTest.createRouter(controller);

      // Assert
      routes.forEach((r) => {
        expect(router[r.method]).to.have.been.called
          .with(r.path, r.handler);
      });
    });
    it('returns router', () => {
      // Act
      const result = unitUnderTest.createRouter(controller);

      // Assert
      expect(result).to.equal(router);
    });
  });

  describe('WebApplicationBuilder#registerControllers(app, controllers)', () => {
    it('creates router for each controller in controllers', () => {
      // Arrange
      const controller2 = new ControllerMock();
      const controllers = [controller, controller2];
      sandbox.on(unitUnderTest, 'createRouter');

      // Act
      unitUnderTest.registerControllers(webApp, controllers);

      // Assert
      controllers.forEach((c) => {
        expect(unitUnderTest.createRouter).to.have.been.called
          .with.exactly(c);
      });
    });

    it('registers each router to app', () => {
      // Arrange
      unitUnderTest.createRouter = c => c;
      sandbox.on(webApp, 'use');
      const controller2 = new ControllerMock();
      const controllers = [controller, controller2];

      // Act
      unitUnderTest.registerControllers(webApp, controllers);

      // Assert
      controllers.forEach((c) => {
        const expectedRouter = unitUnderTest.createRouter(c);
        expect(webApp.use).to.have.been.called.with.exactly(c.mountPath, expectedRouter);
      });
    });
  });
});
