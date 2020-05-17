const Configuration = require('./base');

/**
 * Contains information used when creating client tokens.
 */
class AuthenticationConfiguration extends Configuration {
  constructor() {
    super('AUTHENTICATION');
  }

  /**
   * Number of seconds after which the access token will become invalid.
   * @readonly
   * @returns {number}
   */
  get accessTokensLifetime() {
    return parseInt(this.getValue('ACCESS_LIFETIME'), 10);
  }

  /**
   * Number of seconds after which the refresh (session) token will become invalid.
   * @readonly
   * @returns {Number}
   */
  get refreshTokensLifetime() {
    return parseInt(this.getValue('SESSION_LIFETIME'), 10);
  }

  /**
   * Base part of the secret used to sign access tokens.
   * @readonly
   * @returns {String}
   */
  get accessTokensSecretBase() {
    return this.getValue('ACCESS_SECRET');
  }

  /**
   * Base part of the secret used to sign refresh (sessions) tokens.
   * @readonly
   * @returns {String}
   */
  get refreshTokensSecretBase() {
    return this.getValue('SESSION_SECRET');
  }

  /**
   * Information about tokens issuer. Will be added as 'iss' key in each token's payload.
   */
  get tokensIssuer() {
    return this.getValue('ISSUER');
  }
}

module.exports = AuthenticationConfiguration;
