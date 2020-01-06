const { Schema } = require('mongoose');

/**
 * @implements {MongooseSchema}
 */
const groupSchema = {
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    unique: true,
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  permissions: {
    type: [String],
    required: true,
    default: [],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
};

module.exports = groupSchema;
/**
 * @typedef {import('mongoose').Schema} MongooseSchema
 */
