const Joi = require('@hapi/joi');

const { ValidationError, InvalidOperationError } = require('../error');

const _schema = new WeakMap();

class ValidatedEntity {
  constructor(schema) {
    if (!Joi.isSchema(schema)) {
      throw new InvalidOperationError('Could not create validated entity. Provided argument is not a schema.');
    }
    _schema.set(this, schema);
  }

  validateSelf() {
    /** @type {Joi.Schema} */
    const schema = _schema.get(this);
    const { error } = schema.validate(this);
    if (error) {
      throw new ValidationError([error], error.message);
    }
  }
}

module.exports = ValidatedEntity;
