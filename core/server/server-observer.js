/**
 * Executes functions when events are emmited by HttpServer.
 */
class ServerObserver {
  /**
   * @param {Logger} logger - instance of Logger
   */
  constructor(logger) {
    this.logger = logger;
  }

  /**
   * Attaches event listeners to Server instance.
   * @param {Server} server - nodejs http.Server instance
   */
  watch(server) {
    const { logger } = this;
    server.on('listening', () => logger.info(`Server started on port ${server.address().port}`));
    server.on('stop', () => logger.info('Stopping server...'));
  }
}

module.exports = ServerObserver;
/**
 * @typedef {import('http').Server} Server
 * @typedef {import('../logger/logger')} Logger
 */
