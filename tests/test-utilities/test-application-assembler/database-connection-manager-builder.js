const mongoose = require('mongoose');
const { DatabaseConnectionManager } = require('../../../core/database');
const { DatabaseConfiguration } = require('../../../core/configuration');

const _applicationComponents = new WeakMap();

class TestDatabaseConnectionManagerBuilder {
  build() {
    const dbConfig = new DatabaseConfiguration('TESTS');
    return new DatabaseConnectionManager(this.connectionFactoryMethod.bind(this), dbConfig);
  }

  connectionFactoryMethod() {
    const applicationComponents = _applicationComponents.get(this);
    const databaseConnection = mongoose.createConnection();
    applicationComponents.setDatabaseConnection(databaseConnection);
    return databaseConnection;
  }

  setApplicationComponents(applicationComponents) {
    _applicationComponents.set(this, applicationComponents);
  }

  create() {
    return this.build();
  }
}


module.exports = TestDatabaseConnectionManagerBuilder;
