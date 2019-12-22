/* eslint-disable */
const { Engine: { MissingImplementationError } } = require('../../error');

/**
 * Defines interface for hashing services.
 * @interface IHashingService
 */
class HashingService {
    /**
   * Hashes provided text.
   * @param {String} text String to hash.
   * @param {String=} salt Salt to hash the text with. Generated randomly if not provided.
   * @returns {Hash}
   * @abstract
   */
  hash(text, salt) {
    throw new MissingImplementationError('HashingService#hash method must be implemented.');
  }

    /**
   * Compares text value to a hash.
   * @param {String} text String to compare the hash with.
   * @param {Hash} hash Hash to compare the text to.
   * @returns {Boolean} True if hashed text equals the hash's value.
   */
  async compare(text, hash) {
    throw new MissingImplementationError('HashingService#compare method must be implemented.');
  }
}

module.exports = HashingService;

/**
 * @typedef {import('./hash')} Hash
 */