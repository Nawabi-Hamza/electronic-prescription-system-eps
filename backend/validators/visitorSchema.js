const Joi = require("joi");

const appointmentSchema = Joi.object({
  patient_name: Joi.string().min(3).max(100).required(),
  age: Joi.number().integer().min(0).max(120).required(),
  phone: Joi.string().pattern(/^[0-9]{10,14}$/).required(),
  description: Joi.string().max(250).allow("", null),
  doctors_id: Joi.number().integer().required(),
  device_id: Joi.string().uuid().required(),
});



module.exports = {
    appointmentSchema
}