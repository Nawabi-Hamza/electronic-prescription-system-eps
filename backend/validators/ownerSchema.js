const Joi = require('joi');

const addDoctorSchema = Joi.object({
    profile: Joi.any(),
    doctor_name: Joi.string().required(),
    clinic_name: Joi.string().required(),
    clinic_fee: Joi.number().optional(),
    lastname: Joi.string().required(),

    date_of_birth: Joi.date()
        .less(new Date(new Date().getFullYear(), 0, 1))
        .messages({
            "date.base": "Date of birth must be a valid date",
            "date.less": "Date of birth cannot be in the current year",
        })
        .optional(),

    experience_year: Joi.number().required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    status: Joi.string().valid('active', 'inactive', 'deleted').required(),
    calendar_type: Joi.string().valid('shamsi', 'qamari', 'miladi').required(),

    phone: Joi.string()
        .pattern(/^[0-9()+-\s]+$/)
        .allow('')
        .messages({
            'string.pattern.base': 'Phone number format is invalid',
        }),

    email: Joi.string().email().required().messages({
        'any.required': 'Email is required',
        'string.email': 'Email must be valid',
    }),

    password: Joi.string().min(8).required().messages({
        "any.required": "Password is required",
        "string.min": "Password must be at least 8 characters",
    }),

    passwordAgain: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .messages({
            "any.only": "Passwords do not match",
            "any.required": "Please confirm your password",
        }),
});

const updateDoctorSchema = Joi.object({
  doctor_name: Joi.string().min(2),

  lastname: Joi.string().min(2),

  clinic_name: Joi.string().min(2),

  clinic_fee: Joi.number().integer().min(0),

  experience_year: Joi.number().integer().min(0).max(60),

  gender: Joi.string().valid("male", "female", "other"),

  status: Joi.string().valid("active", "inactive", "deleted"),

  calendar_type: Joi.string().valid("shamsi", "qamari", "miladi"),

  date_of_birth: Joi.date()
    .less("now")
    .messages({
      "date.base": "Date of birth must be a valid date",
      "date.less": "Date of birth must be in the past",
    }),

  phone: Joi.string()
    .pattern(/^[0-9()+\-\s]+$/)
    .messages({
      "string.pattern.base": "Phone number format is invalid",
    }),

  email: Joi.string().email().messages({
    "string.email": "Email must be valid",
  }),
})
  .min(1) // ⬅ prevents empty update
  .options({ abortEarly: false });

const addDoctorPaymentSchema = Joi.object({
    doctor_id: Joi.number()
        .integer()
        .required()
        .messages({
            "any.required": "Doctor ID is required",
            "number.base": "Doctor ID must be a number",
        }),

    month_number: Joi.number()
        .integer()
        .min(1)
        .max(12)
        .required()
        .messages({
            "any.required": "Month number is required",
            "number.min": "Month must be between 1 and 12",
            "number.max": "Month must be between 1 and 12",
        }),

    amount: Joi.number()
        .min(0)          // ✅ cannot be less than 0
        .max(100000)     // ✅ cannot be more than 100000
        .required()
        .messages({
            "any.required": "Amount is required",
            "number.min": "Amount cannot be less than 0",
            "number.max": "Amount cannot be more than 100000",
        })
});


module.exports = { addDoctorSchema, addDoctorPaymentSchema, updateDoctorSchema };
