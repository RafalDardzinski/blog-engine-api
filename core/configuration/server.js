const Configuration = require('./base');
const { InvalidOperationError } = require('../error/core');

/**
 * Contains information used for configuring Http server.
 */
class ServerConfiguration extends Configuration {
  constructor() {
    super('SERVER');
  }

  /**
   * Port to listen on.
   * @returns {Number} Number of port.
   * @throws {InvalidOperationError} SERVER_PORT env variable must be defined.
   * @throws {InvalidOperationError} SERVER_PORT env variable must be a number.
   */
  get port() {
    const port = this.getValue('PORT');
    if (!port) {
      throw new InvalidOperationError('SERVER_PORT env variable is not specified.');
    }
    const portNumber = parseInt(port, 10);
    if (Number.isNaN(portNumber)) {
      throw new InvalidOperationError(`"${port}" is not a number.`);
    }
    return portNumber;
  }
}

module.exports = ServerConfiguration;
