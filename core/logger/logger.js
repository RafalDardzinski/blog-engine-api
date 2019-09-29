const _logger = new WeakMap();

/**
 * Logger adapter.
 */
class Logger {
  /**
   * @param {object} logger internal logger.
   */
  constructor(logger) {
    _logger.set(this, logger);
  }

  /**
   * @returns {Object} writebable stream object.
   */
  get stream() {
    return {
      write: message => this.info(message.trim()),
    };
  }

  /**
   * Logs debug-level message.
   * @param {string} message Message.
   */
  debug(message) {
    _logger.get(this).debug(message);
  }

  /**
   * Logs info-level message.
   * @param {string} message Message.
   */
  info(message) {
    _logger.get(this).info(message);
  }

  /**
   * Logs error-level message.
   * @param {string} message Message.
   */
  warn(message) {
    _logger.get(this).warn(message);
  }

  /**
   * Logs error-level message.
   * @param {string} message Message.
   */
  error(message) {
    _logger.get(this).error(message);
  }
}

module.exports = Logger;
