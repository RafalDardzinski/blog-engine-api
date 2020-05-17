const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { SchemaPlugin } = require('../../../database');

const _randomBytesPromisified = promisify(randomBytes);

/** @type {WeakMap<Object, Number>} */
const _saltLength = new WeakMap();

function _generateSalt(length) {
  return _randomBytesPromisified(length);
}

/**
 * Changes all salts within document to new, random values.
 * @param {Number} saltLength Defines length of new salts to be generated.
 */
function _refreshSalts(saltLength) {
  console.log(this);
  return async function refreshSalts() {
    const accessSalt = await _generateSalt(saltLength);
    this.set('accessSalt', accessSalt);

    const sessionSalt = await _generateSalt(saltLength);
    this.set('sessionSalt', sessionSalt);
  };
}

/**
 * Extends credential schema with functionalities to manage salts.
 */
class SaltsManagementPlugin extends SchemaPlugin {
  constructor(saltLength) {
    super();
    _saltLength.set(this, saltLength);
  }

  /**
   * @param {MongooseSchema} credentialSchema Credentials database schema.
   */
  functionality(credentialSchema) {
    const saltLength = _saltLength.get(this);

    credentialSchema.method('refreshSalts', _refreshSalts(saltLength));
  }
}

module.exports = SaltsManagementPlugin;
/**
 * @typedef {import('mongoose').Schema} MongooseSchema
 * @typedef {import('mongoose').Document} MongooseDocument
 */
