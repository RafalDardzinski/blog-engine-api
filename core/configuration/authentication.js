const Configuration = require('./base');

class AuthenticationConfiguration extends Configuration {
  constructor() {
    super('AUTHENTICATION');
  }

  get accessTokensLifetime() {
    return this.getValue('ACCESS_LIFETIME');
  }

  get refreshTokensLifetime() {
    return this.getValue('SESSION_LIFETIME');
  }

  get accessTokensSecretBase() {
    return this.getValue('ACCESS_SECRET');
  }

  get refreshTokensSecretBase() {
    return this.getValue('SESSION_SECRET');
  }

  get tokensIssuer() {
    return this.getValue('ISSUER');
  }
}

module.exports = AuthenticationConfiguration;
