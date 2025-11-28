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

module.exports = { addDoctorSchema };
