const { HashingServiceConfiguration } = require('../../configuration');

const Hash = require('./hash');
const HashingService = require('./hashing-service');
const Pbkdf2HashingService = require('./pbkdf2-hashing-service');
const HashSchemaFactoryBase = require('./hash-schema');

class HashingServiceFactory {
  /**
   * Creates a new instance of Hashing service.
   */
  static create() {
    const config = new HashingServiceConfiguration();
    return new Pbkdf2HashingService(config);
  }
}

class HashSchemaFactory {
  static create() {
    const config = new HashingServiceConfiguration();
    const schemaOptions = { _id: false };
    return HashSchemaFactoryBase.create(config, schemaOptions);
  }
}

module.exports = {
  IHashingService: HashingService,
  Hash,
  HashingServiceFactory,
  HashSchemaFactory,
};
