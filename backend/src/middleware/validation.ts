import { Request, Response, NextFunction } from 'express'
import { body, param, query, validationResult } from 'express-validator'

// Handle validation errors
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg,
      value: error.type === 'field' ? error.value : undefined
    }))

    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errorMessages
    })
    return
  }

  next()
}

// Common validation rules
export const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  body('phone')
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage('Please provide a valid phone number'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
]

export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
]

export const validateCreateRestaurant = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Restaurant name must be between 2 and 100 characters'),

  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),

  body('cuisine')
    .isArray({ min: 1 })
    .withMessage('At least one cuisine type is required'),

  body('cuisine.*')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Cuisine type cannot be empty'),

  body('address.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),

  body('address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),

  body('address.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),

  body('address.postalCode')
    .trim()
    .notEmpty()
    .withMessage('Postal code is required'),

  body('address.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Coordinates must be an array of two numbers [longitude, latitude]'),

  body('address.coordinates.*')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Coordinates must be valid numbers'),

  body('contact.phone')
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage('Please provide a valid phone number'),

  body('contact.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  body('deliveryInfo.avgDeliveryTime')
    .isInt({ min: 15, max: 120 })
    .withMessage('Average delivery time must be between 15 and 120 minutes'),

  body('deliveryInfo.deliveryFee')
    .isFloat({ min: 0 })
    .withMessage('Delivery fee must be a non-negative number'),

  body('deliveryInfo.minOrderAmount')
    .isFloat({ min: 0 })
    .withMessage('Minimum order amount must be a non-negative number'),

  body('deliveryInfo.freeDeliveryAbove')
    .isFloat({ min: 0 })
    .withMessage('Free delivery threshold must be a non-negative number'),
]

export const validateCreateOrder = [
  body('restaurantId')
    .isMongoId()
    .withMessage('Valid restaurant ID is required'),

  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),

  body('items.*.menuItemId')
    .isMongoId()
    .withMessage('Valid menu item ID is required'),

  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),

  body('deliveryAddress')
    .isObject()
    .withMessage('Delivery address is required'),

  body('deliveryAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),

  body('deliveryAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),

  body('deliveryAddress.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),

  body('deliveryAddress.postalCode')
    .trim()
    .notEmpty()
    .withMessage('Postal code is required'),

  body('deliveryAddress.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Coordinates must be an array of two numbers [longitude, latitude]'),

  body('deliveryAddress.coordinates.*')
    .isFloat()
    .withMessage('Coordinates must be valid numbers'),

  body('paymentMethod')
    .isIn(['card', 'wallet', 'cod'])
    .withMessage('Payment method must be card, wallet, or cod'),
]

export const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),

  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL'),
]

export const validateAddAddress = [
  body('type')
    .isIn(['home', 'work', 'other'])
    .withMessage('Address type must be home, work, or other'),

  body('street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),

  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),

  body('state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),

  body('postalCode')
    .trim()
    .notEmpty()
    .withMessage('Postal code is required'),

  body('coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Coordinates must be an array of two numbers [longitude, latitude]'),

  body('coordinates.*')
    .isFloat()
    .withMessage('Coordinates must be valid numbers'),
]

export const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Valid ID is required'),
]

export const validateRestaurantQuery = [
  query('cuisine')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Cuisine filter cannot be empty'),

  query('lat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),

  query('lng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),

  query('radius')
    .optional()
    .isFloat({ min: 100, max: 50000 })
    .withMessage('Radius must be between 100 and 50000 meters'),
]