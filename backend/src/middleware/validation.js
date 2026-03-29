import { body, validationResult } from 'express-validator';

export const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),
  body('role')
    .optional()
    .isIn(['Admin', 'Client', 'User'])
    .withMessage('Invalid role'),
];

export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const validateClient = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Client name is required'),
  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company name is required'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('contact')
    .notEmpty()
    .withMessage('Contact number is required'),
  body('planType')
    .optional()
    .isIn(['Starter', 'Professional', 'Enterprise'])
    .withMessage('Invalid plan type'),
];

export const validateService = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Service name is required'),
  body('description')
    .notEmpty()
    .withMessage('Service description is required'),
  body('pricing')
    .isNumeric()
    .withMessage('Pricing must be a number')
    .custom((value) => value >= 0)
    .withMessage('Pricing cannot be negative'),
];

export const validateTicket = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Ticket title is required'),
  body('description')
    .notEmpty()
    .withMessage('Ticket description is required'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Invalid priority'),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      statusCode: 400,
      errors: errors.array(),
    });
  }
  next();
};
