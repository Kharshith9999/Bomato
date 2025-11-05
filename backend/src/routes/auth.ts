import express from 'express'
import * as authController from '@/controllers/authController'
import { authenticate } from '@/middleware/auth'
import {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  handleValidationErrors
} from '@/middleware/validation'
import { body } from 'express-validator'

const router = express.Router()

// Public routes
router.post('/register',
  validateRegister,
  handleValidationErrors,
  authController.register
)

router.post('/login',
  validateLogin,
  handleValidationErrors,
  authController.login
)

router.post('/refresh-token',
  [
    body('refreshToken')
      .notEmpty()
      .withMessage('Refresh token is required'),
    handleValidationErrors
  ],
  authController.refreshToken
)

// Protected routes
router.post('/logout',
  authenticate,
  authController.logout
)

router.get('/me',
  authenticate,
  authController.getCurrentUser
)

router.put('/profile',
  authenticate,
  validateUpdateProfile,
  handleValidationErrors,
  authController.updateProfile
)

router.put('/change-password',
  authenticate,
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
    handleValidationErrors
  ],
  authController.changePassword
)

export default router