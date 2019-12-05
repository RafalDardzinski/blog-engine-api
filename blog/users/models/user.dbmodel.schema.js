const { Schema } = require('mongoose');

/**
 * Database schema for User.
 */
const userModelSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: [5, 'Username has to be at least 5 characters long.'],
    maxlength: [50, 'Username cannot be longer than 50 characters.'],
    unique: true,
    immutable: true,
    index: true,
  },
  // TODO: change for sub-document with hash and salt.
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    match: [/\S+@\S+\.\S+/, 'Provided e-mail address is invalid.'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = userModelSchema;
