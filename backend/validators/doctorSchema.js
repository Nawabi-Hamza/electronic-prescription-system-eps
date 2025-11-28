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




const addMedicineSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  brand_name: Joi.string().allow(null, "").max(255),
  form: Joi.string().min(2).max(100).required(),
  strength: Joi.string().allow(null, "").max(100),
  category: Joi.string().allow(null, "").max(100),
  description: Joi.string().allow(null, ""),
  side_effects: Joi.string().allow(null, ""),
  interactions: Joi.string().allow(null, ""),
  is_common: Joi.boolean().default(false)
});


module.exports = {
    addMedicineSchema
};
