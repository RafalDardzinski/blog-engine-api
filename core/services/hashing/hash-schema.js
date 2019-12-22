const { SchemaBuilder } = require('../../database');

class HashSchemaFactory {
  /**
   * Creates instance of hash schema.
   * @param {HashingServiceConfiguration} config Hashing service configuration.
   */
  static create(config, schemaOptions = {}) {
    const hashSchema = {
      value: {
        type: String,
        length: config.hashLength * 2,
        required: true,
      },
      salt: {
        type: String,
        length: config.saltLength * 2,
        required: true,
      },
    };

    const schemaBuilder = new SchemaBuilder();
    schemaBuilder.create(hashSchema, schemaOptions);
    return schemaBuilder.build();
  }
}

module.exports = HashSchemaFactory;
/**
 * @typedef {import('../../configuration/hashing')} HashingServiceConfiguration
 */
