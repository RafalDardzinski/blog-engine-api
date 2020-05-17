const { Schema } = require('mongoose');

const credentialSchema = {
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // TODO: To be expanded in the future.
  details: {
    type: String,
    maxLength: 255,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  accessSalt: {
    type: Buffer,
    minlength: 32,
    required: true,
  },
  sessionSalt: {
    type: Buffer,
    minlength: 32,
    required: true,
  },
};

module.exports = credentialSchema;
