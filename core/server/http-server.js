const http = require('http');
const { InvalidOperationError } = require('../error');

/**
 * Node's HttpServer adapter.
 */
class HttpServer {
  /**
    * @param {Object} config - configuration for the server.
    * @param {ServerObserver=} observer - instance of ServerObserver
   */
  constructor(config, observer) {
    this.config = config;
    this.observer = observer;
  }

  /**
   * Starts HttpServer using provided request handler function. If observer is provided,
   * sets it to watch the application.
   * @param {Function} webApp Request handler function.
   */
  start(webApp) {
    const { port } = this.config;
    this.instance = http.createServer(webApp);
    const { instance, observer } = this;

    if (observer) {
      observer.watch(instance);
    }

    return new Promise((resolve, reject) => {
      this.instance.listen(port, resolve)
        .on('error', reject);
    });
  }

  /**
   * Stops running http server. Throws InvalidOperationError if server was not running.
   * @throws {InvalidOperationError} Server must be running.
   */
  stop() {
    const { instance } = this;
    if (instance && instance.listening) return instance.close();
    throw new InvalidOperationError('Cannot stop server that is not running.');
  }
}

module.exports = HttpServer;
/**
 * @typedef {import('./server-observer.js')} ServerObserver
 */
