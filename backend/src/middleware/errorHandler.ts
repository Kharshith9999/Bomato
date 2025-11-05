import { Request, Response, NextFunction } from 'express'

export interface AppError extends Error {
  statusCode?: number
  isOperational?: boolean
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { statusCode = 500, message } = error

  // Log error for debugging
  console.error(`Error ${req.method} ${req.path}:`, {
    message: error.message,
    stack: error.stack,
    statusCode,
    body: req.body,
    params: req.params,
    query: req.query,
  })

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    statusCode = 400
    message = Object.values((error as any).errors)
      .map((val: any) => val.message)
      .join(', ')
  }

  // Mongoose duplicate key error
  if (error.name === 'MongoServerError' && (error as any).code === 11000) {
    statusCode = 400
    const field = Object.keys((error as any).keyValue)[0]
    message = `${field} already exists`
  }

  // Mongoose cast error
  if (error.name === 'CastError') {
    statusCode = 400
    message = 'Invalid ID format'
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token'
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expired'
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Internal server error'
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      details: error,
    }),
  })
}

export const createError = (message: string, statusCode: number = 500): AppError => {
  const error = new Error(message) as AppError
  error.statusCode = statusCode
  error.isOperational = true
  return error
}

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}