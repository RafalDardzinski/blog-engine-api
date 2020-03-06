const mongoose = require('mongoose');

const { DatabaseConnectionManager } = require('../../../core/database');
const { DatabaseConfiguration } = require('../../../core/configuration');

const _applicationComponents = new WeakMap();

function _connectionFactoryMethod() {
  const applicationComponents = _applicationComponents.get(this);
  const databaseConnection = mongoose.createConnection();
  applicationComponents.setDatabaseConnection(databaseConnection);
  return databaseConnection;
}

/**
 * Creates DatabaseConnectionManager for test purposes.
 */
class TestDatabaseConnectionManagerFactory {
  /**
   * Sets application components to be used later.
   * @param {ApplicationComponents} applicationComponents Instance of ApplicationComponents.
   */
  setApplicationComponents(applicationComponents) {
    _applicationComponents.set(this, applicationComponents);
  }

  /**
   * Creates database connection manager.
   */
  create() {
    const dbConfig = new DatabaseConfiguration('TESTS');
    return new DatabaseConnectionManager(_connectionFactoryMethod.bind(this), dbConfig);
  }
}


module.exports = TestDatabaseConnectionManagerFactory;
/**
 * @typedef {import('../application-components')} ApplicationComponents
 */
