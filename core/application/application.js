// TODO: Replace logger with events and observer pattern.
const { LoggerFactory } = require('../logger');
const { Ensure } = require('../utility');

const _webApplication = new WeakMap();
const _databaseConnectionManager = new WeakMap();
const _logger = new WeakMap();

/**
 * Represents fully built application.
 */
class Application {
  constructor(webApplication, databaseConnectionManager) {
    Ensure.isDefined(webApplication, 'webApplication');
    Ensure.isDefined(databaseConnectionManager, 'databaseConnectionManager');
    _webApplication.set(this, webApplication);
    _databaseConnectionManager.set(this, databaseConnectionManager);
    _logger.set(this, LoggerFactory.create());
  }

  /**
   * Application name, including version.
   * @returns {String} Application name and version.
   */
  get name() {
    const name = process.env.npm_package_name;
    const version = process.env.npm_package_version;
    return `${name} v.${version}`;
  }

  /**
   * Runs the application on provided http server.
   * @param {HttpServer} server Instance of http server.
   */
  async run(server) {
    const webApplication = _webApplication.get(this);
    const databaseConnectionManager = _databaseConnectionManager.get(this);
    const logger = _logger.get(this);

    try {
      await databaseConnectionManager.connect();
      await server.start(webApplication);
      logger.info(`${this.name} started...`);
    } catch (error) {
      // TODO: emit error event
      if (databaseConnectionManager.isConnected) {
        await databaseConnectionManager.disconnect();
      }

      logger.error(`Failed to initialize ${this.name}!`);
      logger.error(error.message);
      throw error; // TODO: implement classy exit :)
    }
  }
}

module.exports = Application;
/**
 * @typedef {import('../server/http-server')} HttpServer
 */
