const CoreApplication = require('./application');
const CoreAuthorization = require('./authorization');
const CoreDatabase = require('./database');
const CoreError = require('./error');
const CoreModules = require('./modules');
const CoreServer = require('./server');
const CoreWeb = require('./web');


// Application
const { ApplicationFactory, ApplicationModule, ApplicationModulesManager } = CoreApplication;
const { permissionsManager } = CoreAuthorization;
const webApplicationBuilder = CoreWeb.ExpressWebApplicationBuilderFactory.create();
const applicationModulesManager = new ApplicationModulesManager();
const applicationFactory = new ApplicationFactory(
  CoreModules,
  webApplicationBuilder,
  permissionsManager,
  applicationModulesManager,
);

module.exports.Application = {
  applicationFactory,
  ApplicationModule,
};

// Database
const { DatabaseConnectionManagerFactory } = CoreDatabase;
module.exports.Database = {
  DatabaseConnectionManagerFactory,
};

// Error
const { BusinessLogic } = CoreError;
module.exports.Error = BusinessLogic;

// Server
const { HttpServerFactory } = CoreServer;
module.exports.Server = {
  HttpServerFactory,
};

// const Database = require('./database');
// const { BusinessLogic } = require('./error');
// const Generics = require('./generics');
// const Logger = require('./logger');
// const Server = require('./server');
// const Web = require('./web');

// module.exports = {
//   Application: {
//     ApplicationModule,
//   },
//   Database,
//   Error: BusinessLogic,
//   Generics,
//   Logger,
//   Server,
//   Web,
// };
