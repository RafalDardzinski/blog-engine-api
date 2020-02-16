require('dotenv').config();

const {
  ApplicationFactory,
  ApplicationModulesManager,
  ApplicationInitializer,
} = require('../../core/application');
const CoreModules = require('../../core/modules');
const { ExpressWebApplicationBuilderFactory } = require('../../core/web');
const { permissionsManager } = require('../../core/authorization');

const { TestApplicationAssembler, TestDatabaseConnectionManagerBuilder, TestHttpServerBuilder } = require('./test-application-assembler');
const Utilities = require('./utilities');

const webApplicationBuilder = ExpressWebApplicationBuilderFactory.create();
const applicationModulesManager = new ApplicationModulesManager();

const applicationFactory = new ApplicationFactory(
  CoreModules,
  webApplicationBuilder,
  permissionsManager,
  applicationModulesManager,
);

const databaseConnectionManagerFactory = new TestDatabaseConnectionManagerBuilder();
const serverFactory = new TestHttpServerBuilder();
const applicationInitializer = new ApplicationInitializer(
  databaseConnectionManagerFactory,
  applicationFactory,
  serverFactory,
);

const testApplicationAssembler = new TestApplicationAssembler(applicationInitializer);
const utilities = new Utilities(testApplicationAssembler);

module.exports = {
  utilities,
};
