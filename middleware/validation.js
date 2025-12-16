// Input validation middleware
const { body, validationResult } = require('express-validator');

// Validation rules
const validateSignup = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email must be less than 255 characters'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .isLength({ max: 128 })
    .withMessage('Password must be less than 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Name must be less than 100 characters')
    .escape(), // Prevent XSS
];

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const validateMedicine = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Medicine name is required')
    .isLength({ max: 200 })
    .withMessage('Medicine name must be less than 200 characters')
    .escape(),
  body('dose')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Dose must be less than 100 characters')
    .escape(),
  body('frequency')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Frequency must be less than 100 characters')
    .escape(),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters')
    .escape(),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
];

const validateVaccine = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Vaccine name is required')
    .isLength({ max: 200 })
    .withMessage('Vaccine name must be less than 200 characters')
    .escape(),
  body('date')
    .notEmpty()
    .withMessage('Vaccine date is required')
    .isISO8601()
    .withMessage('Vaccine date must be a valid date'),
  body('provider')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Provider must be less than 200 characters')
    .escape(),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters')
    .escape(),
];

const validateAppointment = [
  body('doctor')
    .trim()
    .notEmpty()
    .withMessage('Doctor name is required')
    .isLength({ max: 200 })
    .withMessage('Doctor name must be less than 200 characters')
    .escape(),
  body('date')
    .notEmpty()
    .withMessage('Appointment date is required')
    .isISO8601()
    .withMessage('Appointment date must be a valid date'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location must be less than 200 characters')
    .escape(),
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Reason must be less than 200 characters')
    .escape(),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters')
    .escape(),
];

// Middleware to check validation results
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

module.exports = {
  validateSignup,
  validateLogin,
  validateMedicine,
  validateVaccine,
  validateAppointment,
  checkValidation,
};

