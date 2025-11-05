import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User, IUser } from '@/models'
import { AuthenticatedRequest, IJwtPayload } from '@/types'
import { createError } from './errorHandler'

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('Access token is required', 401)
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    if (!token) {
      throw createError('Access token is required', 401)
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as IJwtPayload

    if (decoded.type !== 'access') {
      throw createError('Invalid token type', 401)
    }

    // Get user from database
    const user = await User.findById(decoded.userId).select('-password')

    if (!user) {
      throw createError('User not found', 401)
    }

    if (!user.emailVerified || !user.phoneVerified) {
      throw createError('Email and phone verification required', 401)
    }

    // Attach user to request object
    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(createError('Invalid token', 401))
    } else if (error.name === 'TokenExpiredError') {
      next(createError('Token expired', 401))
    } else {
      next(error)
    }
  }
}

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next() // No token, continue without authentication
    }

    const token = authHeader.substring(7)

    if (!token) {
      return next()
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as IJwtPayload

    if (decoded.type !== 'access') {
      return next()
    }

    const user = await User.findById(decoded.userId).select('-password')

    if (user && user.emailVerified && user.phoneVerified) {
      req.user = user
    }

    next()
  } catch (error) {
    // For optional auth, we don't throw errors on invalid tokens
    next()
  }
}

export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(createError('Authentication required', 401))
    }

    // For now, we don't have roles in the User model, but this is where you'd check
    // if (roles.length && !roles.includes(req.user.role)) {
    //   return next(createError('Insufficient permissions', 403))
    // }

    next()
  }
}

export const generateTokens = (user: IUser): { accessToken: string; refreshToken: string } => {
  const payload: IJwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    type: 'access'
  }

  const refreshPayload: IJwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    type: 'refresh'
  }

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
    issuer: 'bomato',
    audience: 'bomato-users'
  })

  const refreshToken = jwt.sign(refreshPayload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
    issuer: 'bomato',
    audience: 'bomato-users'
  })

  return { accessToken, refreshToken }
}

export const verifyRefreshToken = (token: string): IJwtPayload => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as IJwtPayload

    if (decoded.type !== 'refresh') {
      throw createError('Invalid refresh token', 401)
    }

    return decoded
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw createError('Invalid refresh token', 401)
    } else if (error.name === 'TokenExpiredError') {
      throw createError('Refresh token expired', 401)
    }
    throw error
  }
}