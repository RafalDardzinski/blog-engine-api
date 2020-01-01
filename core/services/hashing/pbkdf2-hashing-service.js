const crypto = require('crypto');
const { promisify } = require('util');

const Hash = require('./hash');
const HashingService = require('./hashing-service');

const _config = new WeakMap();
const _hashWithPbkdf2 = promisify(crypto.pbkdf2);

/**
 * @param {String} text Text to hash.
 * @param {String} salt Salt to hash the text with.
 * @param {HashingServiceConfiguration} config Hashing service configuration.
 * @returns {Hash}
 */
async function _hash(text, salt, config) {
  const {
    secret,
    iterations,
    hashLength,
    algorithm,
  } = config;

  const textToHash = (secret) ? `${secret}x${text}` : text;
  const derivedKey = await _hashWithPbkdf2(textToHash, salt, iterations, hashLength, algorithm);
  return new Hash(derivedKey.toString('hex'), salt);
}

/**
 * Used to work with hashed values.
 * @implements {IHashingService}
 */
class Pbkdf2HashingService extends HashingService {
  /**
   * @param {HashingServiceConfiguration} config Hashing service configuration.
   */
  constructor(config) {
    super();
    _config.set(this, config);
  }

  /**
   * Hashes provided text.
   * @param {String} text String to hash.
   * @param {String=} salt Salt to hash the text with. Generated randomly if not provided.
   * @returns {Hash}
   */
  hash(text, salt) {
    /** @type {HashingServiceConfiguration} */
    const config = _config.get(this);
    if (salt) {
      return _hash(text, salt, config);
    }
    const randomSalt = crypto.randomBytes(config.saltLength).toString('hex');
    return _hash(text, randomSalt, config);
  }

  /**
   * Compares text value to a hash.
   * @param {String} text String to compare the hash with.
   * @param {Hash} hash Hash to compare the text to.
   * @returns {Boolean} True if hashed text equals the hash's value.
   */
  async compare(text, hash) {
    const textHash = await this.hash(text, hash.salt);
    return textHash.value === hash.value;
  }
}

module.exports = Pbkdf2HashingService;

/**
 * @typedef {import('../../configuration/hashing')} HashingServiceConfiguration
 * @typedef {import('./hashing-service')} IHashingService
 */
