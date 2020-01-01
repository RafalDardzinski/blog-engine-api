const Joi = require('@hapi/joi');

class Hash {
  constructor(value, salt) {
    Joi.assert(value, Joi.string().exist(), 'Hash must have defined value.');
    Joi.assert(salt, Joi.string().exist(), 'Hash must have defined salt.');
    this.value = value;
    this.salt = salt;
  }
}

module.exports = Hash;
