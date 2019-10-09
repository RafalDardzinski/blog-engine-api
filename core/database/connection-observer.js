const EVENTS = require('./connection-events');

/**
 * Monitors connection and invokes registered functions on particular events.
 */
class DatabaseConnectionObserver {
  /**
   * @param {Logger} logger Instance of Logger class.
   */
  constructor(logger) {
    this.logger = logger;
  }

  /**
   * Registers event handlers on database connection events.
   * @param {Connection} connection Connection to register event handlers on.
   */
  watch(connection) {
    const events = Object.values(EVENTS);
    events.forEach((e) => {
      const eventNameCapital = e.replace(e.charAt(0), e.charAt(0).toUpperCase());
      const handler = this[`on${eventNameCapital}`];
      if (handler && typeof handler === 'function') {
        connection.on(e, handler.bind(this));
      }
    });
  }

  onConnecting() {
    this.logger.debug('Connecting to the database...');
  }

  onConnected() {
    this.logger.info('Connection to database established!');
  }

  onError(err) {
    this.logger.error(err.message);
    throw err;
  }

  onReconnecting() {
    this.logger.debug('Re-establishing database connection...');
  }

  onReconnected() {
    this.logger.info('Connection to the database re-established!');
  }

  onDisconnected() {
    this.logger.error('Connection to the database lost!');
  }
}

module.exports = DatabaseConnectionObserver;
/**
 * @typedef {import('../logger/logger')} Logger
 * @typedef {import('mongoose').Connection} Connection
 */
