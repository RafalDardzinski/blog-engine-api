const { SchemaPlugin } = require('../../../database');

class VirtualsPlugin extends SchemaPlugin {
  /**
   * @param {MongooseSchema} schema Group schema.
   */
  functionality(schema) {
    schema.virtual('membersCount').get(function getMembersCount() {
      return this.members.length;
    });
  }
}


module.exports = VirtualsPlugin;
/**
 * @typedef {import('mongoose').Schema} MongooseSchema
 */
