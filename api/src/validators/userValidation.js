const Joi = require("joi");

const updateUserProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).optional(),
  email: Joi.string().trim().lowercase().email().optional(),
  password: Joi.string().min(6).optional(),
});

module.exports = {
  updateUserProfileSchema,
};
