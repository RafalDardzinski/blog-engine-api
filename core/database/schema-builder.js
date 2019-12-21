const { Schema } = require('mongoose');

const _schema = new WeakMap();

class SchemaBuilder {
  /**
   * Creates new instance of collection schema.
   * @param {Object} schemaObj Object containing defined schema paths.
   * @param {Object=} schemaOptions Schema options.
   */
  create(schemaObj, schemaOptions = {}) {
    _schema.set(this, new Schema(schemaObj, schemaOptions));
  }

  /**
   * Adds plugin to the the schema.
   * @param {SchemaPlugin} plugin Plugin to add.
   */
  addPlugin(plugin) {
    /** @type {Schema} */
    const schema = _schema.get(this);
    plugin.plugToSchema(schema);
  }

  /**
   * Returns built schema.
   * @returns {Schema} Instance of schema.
   */
  build() {
    return _schema.get(this);
  }
}

module.exports = SchemaBuilder;
/**
 * @typedef {import('./schema-plugin')} SchemaPlugin
 */
