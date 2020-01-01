// External module imports
const { LoggerFactory } = require('../logger');
const { ServerConfiguration } = require('../configuration');

// Local imports
const HttpServer = require('./http-server');
const ServerObserver = require('./server-observer');

/**
 * Creates http server.
 */
class HttpServerFactory {
  /**
   * @returns {HttpServer} instance of HttpServer.
   */
  static create() {
    const logger = LoggerFactory.create();
    const serverObserver = new ServerObserver(logger);
    const config = new ServerConfiguration();
    return new HttpServer(config, serverObserver);
  }
}

module.exports = {
  HttpServerFactory,
};
