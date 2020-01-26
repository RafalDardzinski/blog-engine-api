const { Schema } = require('mongoose');
const { permissionSchema } = require('../../../authorization');

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
    type: [permissionSchema],
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
