const { HashSchemaFactory } = require('../../../services/hashing');

const userSchema = {
  username: {
    type: String,
    required: true,
    minlength: [5, 'Username has to be at least 5 characters long.'],
    maxlength: [50, 'Username cannot be longer than 50 characters.'],
    unique: true,
    immutable: true,
    index: true,
  },
  password: {
    type: HashSchemaFactory.create(),
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    minlength: 5,
    maxlength: 50,
    match: [/\S+@\S+\.\S+/, 'Provided e-mail address is invalid.'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
};

module.exports = userSchema;
