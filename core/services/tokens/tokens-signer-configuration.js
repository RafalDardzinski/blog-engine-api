const Joi = require('@hapi/joi');

/** @type {WeakMap<Object, Number>} */
const _validityPeriod = new WeakMap();

/** @type {WeakMap<Object, String>} */
const _issuer = new WeakMap();

/** @type {WeakMap<Object, String>} */
const _subject = new WeakMap();

/** @type {WeakMap<Object, String>} */
const _audience = new WeakMap();

class TokensSignerConfiguration {
  /**
   * @param {Number} validityPeriod Number of seconds after which the
   * token will expire.
   * @param {String} issuer Name of token's issuer.
   * @param {String=} subject Token's purpose.
   * @param {String=} audience Name of token's audience.
   * @throws Parameter 'validityPeriod' must be defined number greater than 60.
   * @throws Parameter 'issuer' must be a defined string with at least 1 character.
   */
  constructor(validityPeriod, issuer, subject, audience) {
    Joi.assert(validityPeriod, Joi.number().exist().greater(60), 'Parameter \'validityPeriod\' must be defined number greater than 60.');
    Joi.assert(issuer, Joi.string().exist().min(1), 'Parameter \'issuer\' must be a defined string with at least 1 character.');

    _validityPeriod.set(this, validityPeriod);
    _issuer.set(this, issuer);
    _subject.set(this, subject);
    _audience.set(this, audience);
  }

  get validityPeriod() {
    return _validityPeriod.get(this);
  }

  get issuer() {
    return _issuer.get(this);
  }

  get subject() {
    return _subject.get(this);
  }

  get audience() {
    return _audience.get(this);
  }
}

module.exports = TokensSignerConfiguration;
