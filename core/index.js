const Application = require('./application');
const Database = require('./database');
const { BusinessLogic } = require('./error');
const Generics = require('./generics');
const Logger = require('./logger');
const Server = require('./server');
const Web = require('./web');

module.exports = {
  Application,
  Database,
  Error: BusinessLogic,
  Generics,
  Logger,
  Server,
  Web,
};
