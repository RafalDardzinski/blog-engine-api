
const Logger = require('./logger');
const winston = require('./winston');

// TODO: Add configuration module.

/**
 * Creates logger.
 */
class LoggerFactory {
  /**
   * Returns instance of Logger class.
   * @param {object=} databaseConfiguration Configuration for saving logs to the database.
   * @returns {Logger} Instance of Logger.
   */
  static create(databaseConfiguration) {
    return new Logger(winston(databaseConfiguration));
  }
}

module.exports = {
  LoggerFactory,
};
/**
 * @typedef {import('./logger')} Logger
 */
