const { ApplicationInitializer } = require('../../../core/application');

const _databaseConnectionManagerFactory = new WeakMap();
const _serverFactory = new WeakMap();

/**
 * Creates instances of ApplicationInitializer for test purposes.
 */
class ApplicationInitializerFactory {
  /**
   * @param {TestDatabaseConnectionManagerFactory} databaseConnectionManagerFactory Instance of
   * TestDatabaseConnectionManagerFactory.
   * @param {TestServerFactory} serverFactory Instance of TestHttpServerFactory.
   */
  constructor(databaseConnectionManagerFactory, serverFactory) {
    _databaseConnectionManagerFactory.set(this, databaseConnectionManagerFactory);
    _serverFactory.set(this, serverFactory);
  }

  create(applicationFactory) {
    const databaseConnectionManagerFactory = _databaseConnectionManagerFactory.get(this);
    const serverFactory = _serverFactory.get(this);

    return new ApplicationInitializer(
      databaseConnectionManagerFactory, applicationFactory, serverFactory,
    );
  }
}

module.exports = ApplicationInitializerFactory;
/**
 * @typedef {import('./database-connection-manager-factory')} TestDatabaseConnectionManagerFactory
 * @typedef {import('./http-server-factory')} TestServerFactory
 * @typedef {import('../../../core/application/application-factory')} ApplicationFactory
 */
