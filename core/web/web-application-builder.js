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
   * @param {WebApplicationComponents} components Components to build application from.
   * @returns {Function} Http server request handler function.
   */
  build(components) {
    components.validateSelf();
    const app = this.appFactory();
    this.buildStrategy.applyDefaultMiddleware(app);
    this.registerControllers(app, components.controllers);
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
    controller.routes.forEach((route) => {
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
   */
  registerControllers(app, controllers) {
    controllers.forEach((c) => {
      const router = this.createRouter(c);
      app.use(c.mountPath, router);
    });
  }
}

module.exports = WebApplicationBuilder;
/**
 * @typedef {import('./web-application-build-strategy')} WebApplicationBuildStrategy
 * @typedef {import('./web-application-components')} WebApplicationComponents
 * @typedef {import('./controller')} Controller
 */
