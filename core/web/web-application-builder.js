const { Engine: { InvalidOperationError } } = require('../error');

/**
 * Builds top-level request handler for http server incoming requests.
 */
class WebApplicationBuilder {
  /**
   * @param {Function} appFactory Factory function that returns top level request handlers.
   * @param {Function} routerFactory Factory function that returns routers.
   * @param {WebApplicationBuildStrategy} buildStrategy Strategy used to apply default components.
   */
  constructor(appFactory, routerFactory, buildStrategy) {
    this.appFactory = appFactory;
    this.routerFactory = routerFactory;
    this.buildStrategy = buildStrategy;
  }

  /**
   * Builds requests handler.
   * @param {ApplicationModulesManager} modulesManager Modules to build application from.
   * @returns {Function} Http server request handler function.
   */
  build(modulesManager) {
    const app = this.appFactory();
    this.buildStrategy.applyDefaultMiddleware(app);
    this.registerControllers(app, modulesManager.controllers);
    this.buildStrategy.applyErrorHandler(app);
    return app;
  }

  /**
   * Builds router applicable to top-level request handler.
   * @param {Controller} controller Controller to build router from.
   * @returns {Function} Router function applicable to the request handler.
   */
  createRouter(controller) {
    controller.validateSelf();
    const router = this.routerFactory();
    controller.registeredRoutes.forEach((route) => {
      route.validateSelf();
      const { method, path, handler } = route;
      router[method](path, handler);
    });

    return router;
  }

  /**
   * Registers controllers on top-level server request handler.
   * @param {Function} app Top level server request handler.
   * @param {Controller[]} controllers Controllers to register.
   * @throws Each controller must have unique 'mountPath' property.
   */
  registerControllers(app, controllers) {
    const mountPaths = controllers.map(c => c.mountPath);
    controllers.forEach((controller, index) => {
      const isMountPathDuplicated = mountPaths.indexOf(controller.mountPath) !== index;
      if (isMountPathDuplicated) {
        throw new InvalidOperationError(`Path ${controller.mountPath} is used more than once.`);
      }

      const router = this.createRouter(controller);
      app.use(controller.mountPath, router);
    });
  }
}

module.exports = WebApplicationBuilder;
/**
 * @typedef {import('./web-application-build-strategy')} WebApplicationBuildStrategy
 * @typedef {import('../application/application-modules-manager')} ApplicationModulesManager
 * @typedef {import('./controller')} Controller
 */
