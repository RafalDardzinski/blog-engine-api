const { Engine: { MissingImplementationError } } = require('../../error');

/**
 * Provides algorithm for generating secret used for signing tokens.
 * @abstract
 * @interface
 */
class SecretGenerationStrategy {
  /**
   * Creates a transmuted secret string.
   * @param {String} secretBase Base of the secret string.
   * @param {String} salt Salt to transmute the secretBase with.
   * @returns {String}
   */
  generateSecret(secretBase, salt) { // eslint-disable-line
    throw new MissingImplementationError();
  }
}

module.exports = SecretGenerationStrategy;
