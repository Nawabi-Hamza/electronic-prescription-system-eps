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


const registerUserSchema = Joi.object({
  username: Joi.string().required().messages({
    'any.required': 'Username is required',
    'string.empty': 'Username cannot be empty',
  }),
  firstname: Joi.string().required().messages({
    'any.required': 'First name is required',
    'string.empty': 'First name cannot be empty',
  }),
  father_name: Joi.string().allow('', null),
  lastname: Joi.string().required().messages({
    'any.required': 'Last name is required',
    'string.empty': 'Last name cannot be empty',
  }),
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Email must be valid',
  }),
  phone: Joi.string().pattern(/^[0-9()+-\s]+$/).allow('', null).messages({
    'string.pattern.base': 'Phone number format is invalid',
  }),
  status: Joi.string().valid('active', 'inactive', 'disabled', 'deleted').optional(),
  salary: Joi.number().precision(2).optional(),
  gender: Joi.string().valid('male', 'female', 'other').optional(),
  user_document: Joi.string().optional(),
  address: Joi.string().optional(),
  national_id: Joi.string().optional(),
  role_id: Joi.number().integer().min(1).required().messages({
    'any.required': 'Role ID is required',
  }),
  branch_id: Joi.number().integer().min(1).required().messages({
    'any.required': 'Branch ID is required',
  }),
  password: Joi.string().min(6).required().messages({
    'any.required': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
  }),
  passwordAgain: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Please confirm your password',
  }),
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

// Schema for creating a new role
const createRoleSchema = Joi.object({
  role_name: Joi.string().min(2).max(50).required(),
  role_directory: Joi.string().min(2).max(50).required()
});

// Schema for updating a role
const updateRoleSchema = Joi.object({
  role_name: Joi.string().min(2).max(50).required(),
  role_directory: Joi.string().min(2).max(50).required()
});

const addressSchema = Joi.object({
  home_address: Joi.string().allow('', null),
  district: Joi.string().allow('', null),
  province: Joi.string().allow('', null),
  country: Joi.string().allow('', null),
});

// Schema for students
const baseStudentSchema = Joi.object({
  firstname: Joi.string().required(),
  father_name: Joi.string().required(),
  grand_father_name: Joi.string().required(),
  lastname: Joi.string().required(),
  date_of_birth: strictDate.optional(),
  join_date: strictDate.optional(),
  nationality: Joi.string().required(),
  mother_language: Joi.string().required(),
  father_job: Joi.string().required(),
  current_address: Joi.optional(),
  permanent_address: Joi.optional(),
  brother_name: Joi.string().allow('', null),
  mama_name: Joi.string().allow('', null),
  brother_name2: Joi.string().allow('', null),
  kaka_name: Joi.string().allow('', null),
  bacha_kaka_name: Joi.string().allow('', null),
  bacha_mama_name: Joi.string().allow('', null),
  gender: Joi.string().valid('male', 'female').required(),
  national_id: Joi.string().required(),
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Email must be valid',
  }),
  phone: Joi.string().pattern(/^[0-9()+-\s]+$/).allow('', null).messages({
    'string.pattern.base': 'Phone number format is invalid',
  }),
  whatsapp_phone: Joi.string().pattern(/^[0-9()+-\s]+$/).allow('', null).messages({
    'string.pattern.base': 'Phone number format is invalid',
  }),
  assas_number: Joi.number().integer().required(),
  students_profile: Joi.any(),
  description: Joi.string().optional(),
});

// Schema for classes
const classSchema = Joi.object({
  class_name: Joi.string().max(255).required(),
  class_code: Joi.string().max(255).required(),
  class_status: Joi.string().valid('Active', 'Inactive').required(),
  room_number: Joi.string().max(50).required(),
  start_timing: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      'string.pattern.base': 'Start time must be in HH:MM format',
      'string.empty': 'Start time is required',
    }),
  end_timing: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      'string.pattern.base': 'End time must be in HH:MM format',
      'string.empty': 'End time is required',
    }),
  class_fee: Joi.number().integer().min(0).required(),
  class_capacity: Joi.number().integer().min(1).required()
});




const addUserSchema = Joi.object({
  username: Joi.string().required().messages({
    "any.required": "Username is required",
    "string.empty": "Username cannot be empty",
  }),
  firstname: Joi.string().required().messages({
    "any.required": "First name is required",
    "string.empty": "First name cannot be empty",
  }),
  father_name: Joi.string().allow("", null),
  lastname: Joi.string().required().messages({
    "any.required": "Last name is required",
    "string.empty": "Last name cannot be empty",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Email must be valid",
  }),
  phone: Joi.string()
    .pattern(/^[0-9()+-\s]+$/)
    .allow("", null)
    .messages({
      "string.pattern.base": "Phone number format is invalid",
    }),
  status: Joi.string().valid("active", "inactive", "disabled", "deleted").optional(),
  salary: Joi.number().precision(2).optional(),
  gender: Joi.string().valid("male", "female", "other").optional(),
  shift: Joi.string().valid("full time", "morning", "afternoon", "evening").required(),
  national_id: Joi.string().optional(),

  // ✅ New Address Validation
  permanent_address: addressSchema.optional(),
  current_address: addressSchema.optional(),

  role_id: Joi.number().valid(3, 4, 6, 7).required().messages({
    "any.required": "Role is required",
    "any.only": "Invalid role selected",
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": "Password is required",
    "string.min": "Password must be at least 6 characters",
  }),
  passwordAgain: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
      "any.required": "Please confirm your password",
    }),

  // ✅ Files validation
  user_documents: Joi.any()
    .required()
    .custom((value, helpers) => {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        return helpers.error("any.required");
      }
      return value;
    })
    .messages({
      "any.required": "At least one document is required",
    }),
  profile_pic: Joi.any()
    .required()
    .messages({
      "any.required": "Profile picture is required",
    }),
});



const updateUserHRSchema = Joi.object({
  role_id: Joi.number().valid(3, 4, 6, 7).required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  father_name: Joi.string().required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  shift: Joi.string().valid('full time', 'morning', 'afternoon', 'evening').required(),
  national_id: Joi.string().required(),
  username: Joi.string().required(),
  salary: Joi.number().required(),
  remove_documents: Joi.string().required(),
  // profile_pic and newDocuments are optional files
  newDocuments: Joi.any().optional()
    .custom((value, helpers) => {
      // Only check if value exists
      if (value && Array.isArray(value) && value.length === 0) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "any.invalid": "At least one new document is required if provided",
    }),
  profile_pic: Joi.any().optional(), // optional, no error
});


module.exports = {
  registerUserSchema,
  loginSchema, 
  updatePasswordSchema,
  createRoleSchema,
  updateRoleSchema,
  baseStudentSchema,
  classSchema,
  addUserSchema,
  updateUserHRSchema
};
