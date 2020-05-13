const Joi = require('@hapi/joi');

const TokensSignerConfiguration = require('./tokens-signer-configuration');
const SecretGenerationStrategy = require('./secret-generation-strategy');
const { JsonWebTokenService, JsonWebTokenError } = require('./jwt-service');

/** @type {WeakMap<Object, TokensSignerConfiguration>} */
const _tokensSignerConfiguration = new WeakMap();

/** @type {WeakMap<Object, String>} */
const _secretBase = new WeakMap();

/** @type {WeakMap<Object, SecretGenerationStrategy>} */
const _secretGenerationStrategy = new WeakMap();

class TokensSigner {
  /**
   * @param {TokensSignerConfiguration} tokensSignerConfiguration Instance of
   * TokensSignerConfiguration.
   * @param {String} secretBase String used as base for signing tokens.
   * @param {SecretGenerationStrategy} secretGenerationStrategy Provides logic
   * for transmuting secret used for signing tokens.
   * @throws Parameter 'tokensSignerConfiguration' must be an instance of TokensSignerConfiguration.
   * @throws Parameter 'secretBase' must be a string with at least 8 characters.
   * @throws Parameter 'secretGenerationStrategy' must be an instance of SecretGenerationStrategy.
   */
  constructor(tokensSignerConfiguration, secretBase, secretGenerationStrategy) {
    Joi.assert(tokensSignerConfiguration, Joi.object().exist().instance(TokensSignerConfiguration, 'TokensSignerConfiguration'));
    Joi.assert(secretBase, Joi.string().min(8), 'Parameter \'secretBase\' must be a string with at least 8 characters.');
    Joi.assert(secretGenerationStrategy, Joi.object().exist().instance(SecretGenerationStrategy, 'SecretGenerationStrategy'));

    _tokensSignerConfiguration.set(this, tokensSignerConfiguration);
    _secretBase.set(this, secretBase);
    _secretGenerationStrategy.set(this, secretGenerationStrategy);
  }

  /**
   * Signs provided payload with secret and salt and returns created token.
   * @param {Object} payload Token's payload.
   * @param {String} salt Salt to transmute the secret with.
   */
  sign(payload, salt) {
    const secretGenerationStrategy = _secretGenerationStrategy.get(this);
    const secretBase = _secretBase.get(this);

    const signingSecret = secretGenerationStrategy.generateSecret(secretBase, salt);

    const {
      validityPeriod, issuer, subject, audience,
    } = _tokensSignerConfiguration.get(this);
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
  async isTokenValid(signedToken, salt) {
    const secretGenerationStrategy = _secretGenerationStrategy.get(this);
    const secretBase = _secretBase.get(this);
    const signingSecret = secretGenerationStrategy.generateSecret(secretBase, salt);

    const {
      issuer, subject, audience,
    } = _tokensSignerConfiguration.get(this);
    const options = {
      issuer,
      ...(subject) && { subject },
      ...(audience) && { audience },
    };

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
