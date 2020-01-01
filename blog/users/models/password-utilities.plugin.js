const { SchemaPlugin } = require('../../../core/database');

const _hashingService = new WeakMap();

function _setPassword(hashingService) {
  return async function setPassword(newPassword) {
    const { value, salt } = await hashingService.hash(newPassword);
    if (!this.password) {
      this.password = { value, salt };
      return;
    }

    this.password.value = value;
    this.password.salt = salt;
  };
}

function _checkPassword(hashingService) {
  return async function checkPassword(password) {
    return hashingService.compare(password, this.password);
  };
}

class PasswordUtilitiesPlugin extends SchemaPlugin {
  /**
   * @param {IHashingService} hashingService Hashing service.
   */
  constructor(hashingService) {
    super();
    _hashingService.set(this, hashingService);
  }

  /**
   * @param {MongooseSchema} schema Schema to which the plugin was applied to.
   */
  functionality(schema) {
    const hashingService = _hashingService.get(this);
    schema.method('setPassword', _setPassword(hashingService));
    schema.method('checkPassword', _checkPassword(hashingService));
  }
}

module.exports = PasswordUtilitiesPlugin;
/**
 * @typedef {import('mongoose').Schema} MongooseSchema
 * @typedef {import('../../../core/services/hashing').IHashingService} IHashingService
 */
