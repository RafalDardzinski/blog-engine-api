const Joi = require('@hapi/joi');

/** @type {WeakMap<Object, Number>} */
const _validityPeriod = new WeakMap();

/** @type {WeakMap<Object, String>} */
const _issuer = new WeakMap();

/** @type {WeakMap<Object, String>} */
const _subject = new WeakMap();

/** @type {WeakMap<Object, String>} */
const _secretBase = new WeakMap();

class TokensSignerConfiguration {
  /**
   * @param {Number} validityPeriod Number of seconds after which the
   * token will expire.
   * @param {String=} secretBase Base part of secret that will be used to sign tokens.
   * @param {String} issuer Name of token's issuer.
   * @param {String=} subject Token's purpose.
   * @throws Parameter 'validityPeriod' must be defined number greater than 60.
   * @throws Parameter 'secretBase' must be a string with at least 8 characters.
   * @throws Parameter 'issuer' must be a defined string with at least 1 character.
   */
  constructor(validityPeriod, secretBase, issuer, subject) {
    Joi.assert(validityPeriod, Joi.number().exist().greater(60), 'Parameter \'validityPeriod\' must be defined number greater than 60.');
    Joi.assert(secretBase, Joi.string().exist().min(8), 'Parameter \'secretBase\' must be a string with at least 8 characters.');
    Joi.assert(issuer, Joi.string().exist().min(1), 'Parameter \'issuer\' must be a defined string with at least 1 character.');

    _validityPeriod.set(this, validityPeriod);
    _secretBase.set(this, secretBase);
    _issuer.set(this, issuer);
    _subject.set(this, subject);
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

  get secretBase() {
    return _secretBase.get(this);
  }
}

module.exports = TokensSignerConfiguration;
