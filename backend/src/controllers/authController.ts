import { Request, Response, NextFunction } from 'express'
import { User } from '@/models'
import { generateTokens, verifyRefreshToken } from '@/middleware/auth'
import { asyncHandler, createError } from '@/middleware/errorHandler'
import { AuthenticatedRequest } from '@/types'

// Register user
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { phone }]
  })

  if (existingUser) {
    if (existingUser.email === email) {
      throw createError('Email already registered', 400)
    }
    if (existingUser.phone === phone) {
      throw createError('Phone number already registered', 400)
    }
  }

  // Create new user
  const user = new User({
    name,
    email,
    phone,
    password,
    emailVerified: false,
    phoneVerified: false
  })

  await user.save()

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user)

  // TODO: Send email verification
  // TODO: Send phone verification SMS

  res.status(201).json({
    success: true,
    message: 'User registered successfully. Please verify your email and phone.',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified
      },
      accessToken,
      refreshToken
    }
  })
})

// Login user
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body

  // Find user with password
  const user = await User.findByEmailWithPassword(email)

  if (!user) {
    throw createError('Invalid email or password', 401)
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password)

  if (!isPasswordValid) {
    throw createError('Invalid email or password', 401)
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user)

  // Update last login
  user.updatedAt = new Date()
  await user.save()

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified
      },
      accessToken,
      refreshToken
    }
  })
})

// Refresh tokens
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    throw createError('Refresh token is required', 400)
  }

  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken)

  // Find user
  const user = await User.findById(decoded.userId)

  if (!user) {
    throw createError('User not found', 401)
  }

  if (!user.emailVerified || !user.phoneVerified) {
    throw createError('Email and phone verification required', 401)
  }

  // Generate new tokens
  const tokens = generateTokens(user)

  res.json({
    success: true,
    message: 'Tokens refreshed successfully',
    data: tokens
  })
})

// Get current user
export const getCurrentUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        addresses: user.addresses,
        preferences: user.preferences,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        createdAt: user.createdAt
      }
    }
  })
})

// Logout user
export const logout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // TODO: Add token to blacklist in Redis
  res.json({
    success: true,
    message: 'Logout successful'
  })
})

// Update profile
export const updateProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!
  const { name, avatar, preferences } = req.body

  // Update allowed fields
  if (name !== undefined) user.name = name
  if (avatar !== undefined) user.avatar = avatar
  if (preferences !== undefined) user.preferences = { ...user.preferences, ...preferences }

  await user.save()

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        addresses: user.addresses,
        preferences: user.preferences,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        createdAt: user.createdAt
      }
    }
  })
})

// Change password
export const changePassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    throw createError('Current password and new password are required', 400)
  }

  // Get user with password
  const userWithPassword = await User.findById(user._id).select('+password')

  if (!userWithPassword) {
    throw createError('User not found', 404)
  }

  // Verify current password
  const isCurrentPasswordValid = await userWithPassword.comparePassword(currentPassword)

  if (!isCurrentPasswordValid) {
    throw createError('Current password is incorrect', 400)
  }

  // Validate new password
  if (newPassword.length < 8) {
    throw createError('New password must be at least 8 characters long', 400)
  }

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
    throw createError('New password must contain at least one uppercase letter, one lowercase letter, and one number', 400)
  }

  // Update password
  userWithPassword.password = newPassword
  await userWithPassword.save()

  res.json({
    success: true,
    message: 'Password updated successfully'
  })
})