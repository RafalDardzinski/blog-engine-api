const CoreApplication = require('./application');
const CoreAuthorization = require('./authorization');
const CoreDatabase = require('./database');
const CoreError = require('./error');
const CoreModules = require('./modules');
const CoreServer = require('./server');
const CoreWeb = require('./web');

// Application
const {
  ApplicationFactory,
  ApplicationModule,
  ApplicationModulesManager,
  ApplicationInitializer,
} = CoreApplication;
const { permissionsManager } = CoreAuthorization;
const webApplicationBuilder = CoreWeb.ExpressWebApplicationBuilderFactory.create();

const applicationModulesManager = new ApplicationModulesManager();
const applicationFactory = new ApplicationFactory(
  CoreModules,
  webApplicationBuilder,
  permissionsManager,
  applicationModulesManager,
);

const { DatabaseConnectionManagerFactory } = CoreDatabase;
const { HttpServerFactory } = CoreServer;

const applicationInitializer = new ApplicationInitializer(
  DatabaseConnectionManagerFactory,
  applicationFactory,
  HttpServerFactory,
);

module.exports.Application = {
  applicationFactory,
  applicationInitializer,
  ApplicationModule,
};


// Error
const { BusinessLogic } = CoreError;
module.exports.Error = BusinessLogic;
