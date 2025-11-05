import mongoose from 'mongoose'

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bomato'

    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })

    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB')
    })

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected')
    })

  } catch (error) {
    console.error('Database connection error:', error)
    throw error
  }
}

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close()
    console.log('MongoDB connection closed')
  } catch (error) {
    console.error('Error closing MongoDB connection:', error)
    throw error
  }
}