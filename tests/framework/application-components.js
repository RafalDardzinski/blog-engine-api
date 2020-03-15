const _applicationModules = new WeakMap();
const _databaseConnection = new WeakMap();
const _webApp = new WeakMap();
const _applicationName = new WeakMap();

/**
 * Aggregates various components of application built using test factories.
 */
class ApplicationComponents {
  constructor() {
    _applicationModules.set(this, null);
    _databaseConnection.set(this, null);
    _webApp.set(this, null);
    _applicationName.set(this, null);
  }

  /**
   * Sets application modules.
   * @param {Map<string, ApplicationModule>} applicationModules Application modules.
   * @throws Application modules can be set only once.
   */
  setApplicationModules(applicationModules) {
    const currentApplicationModules = _applicationModules.get(this);
    if (currentApplicationModules) {
      throw new Error('Modules already set.');
    }

    _applicationModules.set(this, applicationModules);
  }

  /**
   * Sets database connection.
   * @param {DatabaseConnection} connection Instance of database connection.
   */
  setDatabaseConnection(connection) {
    _databaseConnection.set(this, connection);
  }

  /**
   * Sets web application.
   * @param {Function} webApp Web application main router.
   */
  setWebApp(webApp) {
    _webApp.set(this, webApp);
  }

  /**
   * Sets name of currently running application.
   * @param {String} applicationName Name of currently running application.
   */
  setApplicationName(applicationName) {
    _applicationName.set(this, applicationName);
  }

  /**
   * Gets application modules.
   * @returns {Map<string, ApplicationModule>} Application modules.
   * @readonly
   */
  get applicationModules() {
    return _applicationModules.get(this);
  }

  /**
   * Gets database connection.
   * @returns {DatabaseConnection} Database connection.
   * @readonly
   */
  get databaseConnection() {
    return _databaseConnection.get(this);
  }

  /**
   * Gets web application main router.
   * @returns {Function} Web application main router.
   * @readonly
   */
  get webApp() {
    return _webApp.get(this);
  }

  /**
   * Gets running application's name.
   * @returns {String} Application's name.
   * @readonly
   */
  get applicationName() {
    return _applicationName.get(this);
  }
}

module.exports = ApplicationComponents;
/**
 * @typedef {import('../../core/application/application-module')} ApplicationModule
 * @typedef {import('../../core/application/application-initializer')} ApplicationInitializer
 * @typedef {import('mongoose').Connection} DatabaseConnection
 */
