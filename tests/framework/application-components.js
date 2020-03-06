const _applicationModules = new WeakMap();
const _databaseConnection = new WeakMap();
const _webApp = new WeakMap();
const _applicationName = new WeakMap();

// TODO: Add documentation
class ApplicationComponents {
  constructor() {
    _applicationModules.set(this, null);
    _databaseConnection.set(this, null);
    _webApp.set(this, null);
    _applicationName.set(this, null);
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

  setApplicationName(applicationName) {
    _applicationName.set(this, applicationName);
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

  get applicationName() {
    return _applicationName.get(this);
  }
}

module.exports = ApplicationComponents;
