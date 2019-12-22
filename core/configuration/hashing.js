const Joi = require('@hapi/joi');

const Configuration = require('./base');

class HashingServiceConfiguration extends Configuration {
  constructor() {
    super('HASH');
  }

  get secret() {
    return this.getValue('SECRET');
  }

  get iterations() {
    const iterations = this.getValue('ITERATIONS');
    Joi.assert(iterations, Joi.number().exist().min(10000), 'HASH_ITERATIONS env variable must be a number equal or higher than 10000.');

    return parseInt(iterations, 10);
  }

  get hashLength() {
    const hashLength = this.getValue('HASH_LENGTH');
    Joi.assert(hashLength, Joi.number().exist().min(64), 'HASH_HASH_LENGTH env variable must be a number equal or higher than 64.');

    return parseInt(hashLength, 10);
  }

  get algorithm() {
    const algorithm = this.getValue('ALGORITHM');
    Joi.assert(algorithm, Joi.string().exist());
    return algorithm;
  }

  get saltLength() {
    const saltLength = this.getValue('SALT_LENGTH');
    Joi.assert(saltLength, Joi.number().exist().min(64), 'HASH_SALT_LENGTH env variable must be a number equal or higher than 64.');
    return parseInt(saltLength, 10);
  }
}

module.exports = HashingServiceConfiguration;
