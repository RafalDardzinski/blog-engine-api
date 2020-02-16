class TestHttpServer {
  constructor(applicationComponents) {
    this.applicationComponents = applicationComponents;
  }

  async start(webApp) {
    this.applicationComponents.setWebApp(webApp);
    return Promise.resolve();
  }
}

const _applicationComponents = new WeakMap();

class TestHttpServerBuilder {
  build() {
    const applicationComponents = _applicationComponents.get(this);
    return new TestHttpServer(applicationComponents);
  }

  setApplicationComponents(applicationComponents) {
    _applicationComponents.set(this, applicationComponents);
  }

  create() {
    return this.build();
  }
}

module.exports = TestHttpServerBuilder;
