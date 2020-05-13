const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const _signPromisified = promisify(jwt.sign);
const _verifyPromisified = promisify(jwt.verify);

/**
 * Adapter for jsonwebtoken library. Contains promisified versions of async (callback based)
 * functions of the original library.
 */
class JsonWebTokenService {
  /**
   * Signs payload with provided secret to create a JSON Web Token.
   * @param {Object} payload Token's payload.
   * @param {String} secret Secret used to sign the token.
   * @param {Object} options Additional options.
   * @returns {Promise<String>}
   */
  static sign(payload, secret, options) {
    return _signPromisified(payload, secret, options);
  }

  /**
   * Verifies token's signature's validity.
   * @param {String} token Signed JSON Web Token.
   * @param {String} secret Secret used to sign the token.
   * @param {Object} options Additional options used to verify token.
   * @returns {Promise<Object>} Token's payload.
   */
  static verify(token, secret, options) {
    return _verifyPromisified(token, secret, options);
  }

  /**
   * Gets token's payload.
   * @param {String} token Signed JSON Web Token.
   * @param {Object} options Additional options.
   * @returns {Object} Token's payload.
   */
  static decode(token, options) {
    return jwt.decode(token, options);
  }
}

const { JsonWebTokenError } = jwt;
module.exports = {
  JsonWebTokenError,
  JsonWebTokenService,
};
