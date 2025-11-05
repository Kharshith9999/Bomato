import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcryptjs'
import { IUser, IAddress, IUserPreferences } from '@/types'

const addressSchema = new Schema<IAddress>({
  type: {
    type: String,
    enum: ['home', 'work', 'other'],
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
    validate: {
      validator: function(coords: number[]) {
        return coords.length === 2 && coords.every(coord => typeof coord === 'number')
      },
      message: 'Coordinates must be an array of two numbers [longitude, latitude]'
    }
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
}, { _id: false })

const userPreferencesSchema = new Schema<IUserPreferences>({
  cuisine: [{
    type: String,
  }],
  dietaryRestrictions: [{
    type: String,
  }],
  defaultPaymentMethod: {
    type: String,
  },
}, { _id: false })

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false, // Don't include password in queries by default
  },
  avatar: {
    type: String,
    default: null,
  },
  addresses: [addressSchema],
  preferences: {
    type: userPreferencesSchema,
    default: () => ({}),
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  phoneVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password
      return ret
    }
  }
})

// Indexes for better performance
userSchema.index({ email: 1 })
userSchema.index({ phone: 1 })
userSchema.index({ 'addresses.coordinates': '2dsphere' }) // Geospatial index

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

// Pre-save middleware to ensure only one default address
userSchema.pre('save', function(next) {
  if (this.addresses && this.addresses.length > 0) {
    const defaultAddresses = this.addresses.filter(addr => addr.isDefault)
    if (defaultAddresses.length > 1) {
      // Keep only the first default address, set others to false
      this.addresses.forEach((addr, index) => {
        if (index > 0) {
          addr.isDefault = false
        }
      })
    }
  }
  next()
})

// Instance method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    return false
  }
}

// Instance method to get default address
userSchema.methods.getDefaultAddress = function(): IAddress | null {
  const defaultAddr = this.addresses.find((addr: IAddress) => addr.isDefault)
  return defaultAddr || (this.addresses.length > 0 ? this.addresses[0] : null)
}

// Static method to find by email with password
userSchema.statics.findByEmailWithPassword = function(email: string) {
  return this.findOne({ email }).select('+password')
}

export const User = mongoose.model<IUser>('User', userSchema)
export default User