import { body } from 'express-validator';

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// CREATE validation - all fields required
const contactValidation = [
  body('name').trim().notEmpty().withMessage('Contact name is required'),
  body('email')
    .optional({ checkFalsy: true })
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('phone').optional().trim(),
  body('notes').optional().trim(),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
];


// UPDATE validation - all fields optional, but at least one required
const updateContactValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Valid email format is required')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .trim()
    .isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits'),
  
  body('notes')
    .optional()
    .isString()
    .trim(),
  
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array')
    .custom((value) => {
      if (value && value.some(tag => typeof tag !== 'string')) {
        throw new Error('All tags must be strings');
      }
      if (value && value.length > 10) {
        throw new Error('Maximum 10 tags allowed');
      }
      return true;
    }),
  
  // Custom validator: At least one field must be provided
  body().custom((value, { req }) => {
    const updateFields = ['name', 'email', 'phone', 'notes', 'tags'];
    const hasAnyField = updateFields.some(field => field in req.body);
    
    if (!hasAnyField) {
      throw new Error('At least one field is required to update the contact');
    }
    return true;
  }).withMessage('At least one field is required to update the contact')
];

// Export both validations
export {
  registerValidation,
  loginValidation,
  contactValidation,
  updateContactValidation
};