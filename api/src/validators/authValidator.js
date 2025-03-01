const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(6).required(),
  address: Joi.string().allow(null, "").max(255),
  state: Joi.string().allow(null, "").max(100),
  country: Joi.string().allow(null, "").max(100),
  userDetails: Joi.object().allow(null),
  role: Joi.string().valid("admin", "user", "company").default("user"),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};
