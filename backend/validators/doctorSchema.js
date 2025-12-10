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


const prescriptionHeaderSchema = Joi.object({
  name_prefex: Joi.string().max(20).allow(null, ""),
  registration_number: Joi.string().max(50).allow(null, ""),
  address_id: Joi.string().max(10).allow(null, ""),
  description: Joi.string().max(100).allow(null, ""),
  template_design: Joi.string().allow(null, '')
});

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM 24-hour format

const daySchema = Joi.object({
  in_time: Joi.string().pattern(timePattern).required()
    .messages({ "string.pattern.base": "Invalid time format (HH:MM)" }),
  out_time: Joi.string().pattern(timePattern).required()
    .messages({ "string.pattern.base": "Invalid time format (HH:MM)" }),
  status: Joi.string().valid("open","close").required()
    .messages({ "any.only": "Status must be either Open or Closed" }),
  slot_duration: Joi.number().integer().min(5).max(180).required()
    .messages({ "number.base": "Slot duration must be a number", 
                "number.min": "Slot duration must be at least 1 minutes",
                "number.max": "Slot duration cannot exceed 180 minutes" }),
});

const updateTimingSchema = Joi.object({
  saturday: daySchema.required(),
  sunday: daySchema.required(),
  monday: daySchema.required(),
  tuesday: daySchema.required(),
  wednesday: daySchema.required(),
  thursday: daySchema.required(),
  friday: daySchema.required(),
});

module.exports = {
    addMedicineSchema,
    prescriptionHeaderSchema,
    updateTimingSchema
};
