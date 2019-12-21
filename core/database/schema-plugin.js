const { Engine: { MissingImplementationError } } = require('../error');

/**
 * Represents additional functionalities that can be added to the database schema.
 * @abstract
 */
class SchemaPlugin {
  /**
   * Schema plugin's functionality.
   * @param {MongooseSchema} schema Schema to which the plugin was applied to.
   * @param {Object} options Functionality options.
   * @abstract
   */
  functionality(schema, options) { // eslint-disable-line
    throw new MissingImplementationError('SchemaPlugin#functionality must have an implementation');
  }

  /**
   * Applies functionality to provided schema.
   * @param {MongooseSchema} schema Schema to apply plugin to.
   */
  plugToSchema(schema) {
    const functionality = this.functionality.bind(this);
    schema.plugin(functionality);
  }
}

module.exports = SchemaPlugin;
/**
 * @typedef {import('mongoose').Schema} MongooseSchema
 */
