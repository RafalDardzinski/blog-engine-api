const TestDatabaseConnectionManagerFactory = require('./database-connection-manager-factory');
const TestHttpServerFactory = require('./http-server-factory');
const TestApplicationAssembler = require('./test-application-assembler');
const ApplicationInitializerFactory = require('./application-initializer-factory');
const TestApplicationFactory = require('./test-application-factory');

const testDatabaseConnectionManagerFactory = new TestDatabaseConnectionManagerFactory();
const testServerFactory = new TestHttpServerFactory();
const applicationInitializerFactory = new ApplicationInitializerFactory(
  testDatabaseConnectionManagerFactory, testServerFactory,
);

module.exports = {
  TestApplicationAssembler,
  TestApplicationFactory,
  applicationInitializerFactory,
};
