const Joi = require('@hapi/joi');

const TokensSignerConfiguration = require('./tokens-signer-configuration');
const SecretGenerationStrategy = require('./secret-generation-strategy');
const { JsonWebTokenService, JsonWebTokenError } = require('./jwt-service');

/** @type {WeakMap<Object, TokensSignerConfiguration>} */
const _tokensSignerConfiguration = new WeakMap();

/** @type {WeakMap<Object, SecretGenerationStrategy>} */
const _secretGenerationStrategy = new WeakMap();

class TokensSigner {
  /**
   * @param {TokensSignerConfiguration} tokensSignerConfiguration Instance of
   * TokensSignerConfiguration.
   * @param {SecretGenerationStrategy} secretGenerationStrategy Provides logic
   * for transmuting secret used for signing tokens.
   * @throws Parameter 'tokensSignerConfiguration' must be an instance of TokensSignerConfiguration.
   * @throws Parameter 'secretGenerationStrategy' must be an instance of SecretGenerationStrategy.
   */
  constructor(tokensSignerConfiguration, secretGenerationStrategy) {
    Joi.assert(tokensSignerConfiguration, Joi.object().exist().instance(TokensSignerConfiguration, 'TokensSignerConfiguration'));
    Joi.assert(secretGenerationStrategy, Joi.object().exist().instance(SecretGenerationStrategy, 'SecretGenerationStrategy'));

    _tokensSignerConfiguration.set(this, tokensSignerConfiguration);
    _secretGenerationStrategy.set(this, secretGenerationStrategy);
  }

  /**
   * Signs provided payload with secret and salt and returns created token.
   * @param {Object} payload Token's payload.
   * @param {String} salt Salt to transmute the secret with.
   */
  sign(payload, salt, audience) {
    const {
      validityPeriod, issuer, subject, secretBase,
    } = _tokensSignerConfiguration.get(this);

    const secretGenerationStrategy = _secretGenerationStrategy.get(this);
    const signingSecret = secretGenerationStrategy.generateSecret(secretBase, salt);
    const options = {
      issuer,
      ...(subject) && { subject },
      ...(audience) && { audience },
      expiresIn: validityPeriod,
    };

    return JsonWebTokenService.sign(payload, signingSecret, options);
  }

  /**
   * Verifies if provided token was signed by this instance of TokensSigner.
   * @param {String} signedToken Signed token.
   * @param {String} salt Salt used to sign provided token.
   */
  async isTokenValid(signedToken, salt, audience) {
    const {
      issuer, subject, secretBase,
    } = _tokensSignerConfiguration.get(this);
    const options = {
      issuer,
      ...(subject) && { subject },
      ...(audience) && { audience },
    };

    const secretGenerationStrategy = _secretGenerationStrategy.get(this);
    const signingSecret = secretGenerationStrategy.generateSecret(secretBase, salt);

    try {
      await JsonWebTokenService.verify(signedToken, signingSecret, options);
      return true;
    } catch (e) {
      if (!(e instanceof JsonWebTokenError)) {
        throw e;
      }

      return false;
    }
  }
}

module.exports = TokensSigner;
