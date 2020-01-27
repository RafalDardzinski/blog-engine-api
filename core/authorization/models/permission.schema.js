/**
 * Database schema for Permission.
 * @implements {MongooseSchema} */
const permissionSchema = {
  name: {
    type: String,
    minlength: 1,
    maxlength: 255,
    required: true,
  },
};

module.exports = permissionSchema;
/**
 * @typedef {import('mongoose').Schema} MongooseSchema
 */
