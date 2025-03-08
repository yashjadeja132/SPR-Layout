const Joi = require("joi");

const ticketSchema = Joi.object({
  category: Joi.string()
    .valid(
      "Technical Support",
      "Billing & Payment",
      "General Inquiry",
      "Feature Request"
    )
    .required()
    .messages({ "any.required": "Category is required." }),

  description: Joi.string().trim().min(10).max(1000).required().messages({
    "string.min": "Description must be at least 10 characters.",
    "string.max": "Description cannot exceed 1000 characters.",
    "any.required": "Description is required.",
  }),

  priority: Joi.string()
    .valid("Low", "Medium", "High", "Critical")
    .default("Medium"),

  status: Joi.string()
    .valid("Open", "In Progress", "Resolved", "Closed")
    .default("Open"),

  assignee: Joi.string().allow(null, "").optional(),

  resolutionNotes: Joi.string().trim().max(1000).allow(null, "").optional(),
});

module.exports = { ticketSchema };
