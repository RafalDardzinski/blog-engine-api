const _applicationModules = new WeakMap();
const _databaseConnection = new WeakMap();
const _webApp = new WeakMap();

class ApplicationComponents {
  constructor() {
    _applicationModules.set(this, null);
    _databaseConnection.set(this, null);
    _webApp.set(this, null);
  }

  setApplicationModules(applicationModules) {
    const currentApplicationModules = _applicationModules.get(this);
    if (currentApplicationModules) {
      throw new Error('Modules already set.');
    }

    _applicationModules.set(this, applicationModules);
  }

  setDatabaseConnection(connection) {
    _databaseConnection.set(this, connection);
  }

  setWebApp(webApp) {
    _webApp.set(this, webApp);
  }

  get applicationModules() {
    return _applicationModules.get(this);
  }

  get databaseConnection() {
    return _databaseConnection.get(this);
  }

  get webApp() {
    return _webApp.get(this);
  }
}

module.exports = ApplicationComponents;
