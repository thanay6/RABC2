import Joi from "joi";

export const userValidationSchema = Joi.object({
  id: Joi.number().optional(),

  userName: Joi.string()
    .pattern(new RegExp("^[a-z0-9._]+$"))
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.pattern.base":
        "Username can only contain letters, numbers, underscores, and periods",
      "string.min": "Username should have a minimum length of {#limit}",
      "string.max": "Username should have a maximum length of {#limit}",
      "any.required": "Username is a required field",
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is a required field",
    }),

  role: Joi.array().items(Joi.string()).required().messages({
    "any.only": "Role must be one of [admin, user, guest]",
    "any.required": "Role is a required field",
  }),

  technology: Joi.array().items(Joi.string()).required().messages({
    "any.required": "Technology is a required field",
  }),

  type: Joi.array().items(Joi.string()).required().messages({
    "any.required": "Type is a required field",
  }),

  phoneNumber: Joi.string()
    .pattern(new RegExp("^[0-9]{10,15}$"))
    .required()
    .messages({
      "string.pattern.base": "Phone number must be between 10 and 15 digits",
      "any.required": "Phone number is a required field",
    }),

  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      "any.required": "Password is a required field",
    }),
});

export const loginValidationSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is a required field",
    }),
  password: Joi.string().required().messages({
    "any.required": "Password is a required field",
  }),
});
