// Global imports
const mongoose = require('mongoose');

// External modules imports
const { DatabaseConfiguration } = require('../configuration');
const { LoggerFactory } = require('../logger');

// Local modules imports
const Model = require('./model');
const Repository = require('./repository');
const DatabaseConnectionManager = require('./connection-manager');
const DatabaseConnectionObserver = require('./connection-observer');
const SchemaBuilder = require('./schema-builder');
const SchemaPlugin = require('./schema-plugin');

// Dependancies config
mongoose.set('useCreateIndex', true);

/**
 * Creates database connection manager.
 */
class DatabaseConnectionManagerFactory {
  /**
   * @param {String} configKey Key do identify the database config in .env file.
   * @returns {DatabaseConnectionManager} Instance of DatabaseConnectionManager class.
   */
  static create(configKey) {
    const connectionFactory = mongoose.createConnection.bind(mongoose);
    const dbCongfig = new DatabaseConfiguration(configKey);
    const logger = LoggerFactory.create();
    const dbConnectionObserver = new DatabaseConnectionObserver(logger);
    return new DatabaseConnectionManager(connectionFactory, dbCongfig, dbConnectionObserver);
  }
}

module.exports = {
  DatabaseConnectionManagerFactory,
  Model,
  Repository,
  SchemaBuilder,
  SchemaPlugin,
};
