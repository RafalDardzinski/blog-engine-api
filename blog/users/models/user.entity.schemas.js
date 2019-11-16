const Joi = require('@hapi/joi');

const userSchemaBase = {
  username: Joi.string().min(5).max(50),
  password: Joi.string(),
  email: Joi.string().regex(/\S+@\S+\.\S+/),
  isActive: Joi.boolean(),
};

const userCreateSchema = Joi.object({
  username: userSchemaBase.username.required(),
  password: userSchemaBase.password.required(),
  email: userSchemaBase.email.required(),
});

const userUpdateSchema = Joi.object({
  email: userSchemaBase.email.optional(),
  isActive: userSchemaBase.isActive.optional(),
});

module.exports = {
  userCreateSchema,
  userUpdateSchema,
};
