const { ApplicationModulesManager } = require('../../core/application');
const CoreModules = require('../../core/modules');
const { ExpressWebApplicationBuilderFactory } = require('../../core/web');
const { permissionsManager } = require('../../core/authorization');
const {
  TestApplicationAssembler,
  TestApplicationFactory,
  applicationInitializerFactory,
} = require('./test-application');
const { testDataManagerFactory, Entity, InitializableEntity } = require('./test-data');
const { webRequestManagerFactory } = require('./web');

const FrameworkFactory = require('./framework-factory');
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

const frameworkFactory = new FrameworkFactory(
  testDataManagerFactory,
  webRequestManagerFactory,
  testApplicationAssembler,
);

module.exports = {
  frameworkFactory,
  Types: {
    Entity,
    InitializableEntity,
    IntegrationTestSuite,
  },
};
