// schemas/authSchema.js
const Joi = require('joi');


const strictDate = Joi.string()
  .pattern(/^\d{4}-\d{2}-\d{2}$/) // only YYYY-MM-DD
  .custom((value, helpers) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) {
      return helpers.error("any.invalid");
    }
    if (value.split("-")[0] < 1300) { // optional min year if Jalali converted
      return helpers.error("any.invalid");
    }
    return value;
  }, "Strict date validation")
  .messages({
    "string.pattern.base": "Date must be in YYYY-MM-DD format",
    "any.invalid": "Invalid date",
  });


const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

const updatePasswordSchema = Joi.object({
  currentPassowrd: Joi.string().min(8).required().messages({
    'any.required': 'Current Password is required',
    'string.min': 'Password must be at least 6 characters',
  }),
  newPassword: Joi.string().min(8).required().messages({
    'any.required': 'New Password is required',
    'string.min': 'Password must be at least 6 characters',
  }),
  repeatPassword: Joi.any().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Retype New Passwords do not match',
    'any.required': 'Please confirm your password',
  }),
})


module.exports = {
  loginSchema, 
  updatePasswordSchema,
};
