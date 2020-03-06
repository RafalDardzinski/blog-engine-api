const CoreModules = require('../../core/modules');
const { ExpressWebApplicationBuilderFactory } = require('../../core/web');
const { permissionsManager } = require('../../core/authorization');
const {
  TestApplicationAssembler,
  TestApplicationFactory,
  applicationInitializerFactory,
} = require('./test-application');
const { TestDataManagerFactory, Entity, InitializableEntity } = require('./test-data');
const FrameworkFactory = require('./framework-factory');

const {
  ApplicationModulesManager,
} = require('../../core/application');

const IntegrationTestSuite = require('./integration-test-suite');

// Dependencies setup.
const webApplicationBuilder = ExpressWebApplicationBuilderFactory.create();
const applicationModulesManager = new ApplicationModulesManager();

const applicationFactory = new TestApplicationFactory(
  CoreModules,
  webApplicationBuilder,
  permissionsManager,
  applicationModulesManager,
);

const applicationInitializer = applicationInitializerFactory.create(applicationFactory);

const testApplicationAssembler = new TestApplicationAssembler(applicationInitializer);
const testDataManager = TestDataManagerFactory.create();
const frameworkFactory = new FrameworkFactory(testDataManager, testApplicationAssembler);

module.exports = {
  frameworkFactory,
  Types: {
    Entity,
    InitializableEntity,
    IntegrationTestSuite,
  },
};
