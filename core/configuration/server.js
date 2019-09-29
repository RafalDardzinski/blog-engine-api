const { InvalidOperationError } = require('../error');

/**
 * Contains information used for configuring Http server.
 */
class ServerConfiguration {
  /**
   * Port to listen on.
   * @static
   * @returns {Number} Number of port.
   * @throws {InvalidOperationError} SERVER_PORT env variable must be defined.
   * @throws {InvalidOperationError} SERVER_PORT env variable must be a number.
   */
  static get port() {
    const { SERVER_PORT } = process.env;
    if (!SERVER_PORT) {
      throw new InvalidOperationError('SERVER_PORT env variable is not specified.');
    }
    const portNumber = parseInt(SERVER_PORT, 10);
    if (Number.isNaN(portNumber)) {
      throw new InvalidOperationError(`${SERVER_PORT} is not a number.`);
    }
    return portNumber;
  }
}

module.exports = ServerConfiguration;
