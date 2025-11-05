import mongoose, { Schema } from 'mongoose'
import { IRestaurant, IDeliveryInfo, IOperatingHour } from '@/types'

const deliveryInfoSchema = new Schema<IDeliveryInfo>({
  avgDeliveryTime: {
    type: Number,
    required: [true, 'Average delivery time is required'],
    min: [15, 'Average delivery time must be at least 15 minutes'],
    max: [120, 'Average delivery time cannot exceed 120 minutes']
  },
  deliveryFee: {
    type: Number,
    required: [true, 'Delivery fee is required'],
    min: [0, 'Delivery fee cannot be negative']
  },
  minOrderAmount: {
    type: Number,
    required: [true, 'Minimum order amount is required'],
    min: [0, 'Minimum order amount cannot be negative']
  },
  freeDeliveryAbove: {
    type: Number,
    required: [true, 'Free delivery threshold is required'],
    min: [0, 'Free delivery threshold cannot be negative']
  }
}, { _id: false })

const operatingHourSchema = new Schema<IOperatingHour>({
  day: {
    type: String,
    required: [true, 'Day is required'],
    enum: {
      values: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      message: 'Day must be a valid day of the week'
    }
  },
  open: {
    type: String,
    required: [true, 'Opening time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format']
  },
  close: {
    type: String,
    required: [true, 'Closing time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format']
  },
  isOpen: {
    type: Boolean,
    default: true
  }
}, { _id: false })

const restaurantSchema = new Schema<IRestaurant>({
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true,
    minlength: [2, 'Restaurant name must be at least 2 characters long'],
    maxlength: [100, 'Restaurant name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Restaurant description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  cuisine: [{
    type: String,
    required: true,
    trim: true,
    lowercase: true
  }],
  address: {
    type: new Schema({
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
    }, { _id: false }),
    required: [true, 'Address is required']
  },
  contact: {
    phone: {
      type: String,
      required: [true, 'Contact phone is required'],
      match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
    },
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    }
  },
  images: [{
    type: String,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(v)
      },
      message: 'Image must be a valid URL ending with jpg, jpeg, png, or webp'
    }
  }],
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be greater than 5']
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: [0, 'Review count cannot be negative']
  },
  deliveryInfo: {
    type: deliveryInfoSchema,
    required: [true, 'Delivery information is required']
  },
  operatingHours: {
    type: [operatingHourSchema],
    required: [true, 'Operating hours are required'],
    validate: {
      validator: function(hours: IOperatingHour[]) {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        const providedDays = hours.map(h => h.day)
        return days.every(day => providedDays.includes(day))
      },
      message: 'Operating hours must be provided for all days of the week'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Restaurant owner is required']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes for better performance
restaurantSchema.index({ 'address.coordinates': '2dsphere' }) // Geospatial index
restaurantSchema.index({ cuisine: 1 })
restaurantSchema.index({ rating: -1 })
restaurantSchema.index({ isActive: 1 })
restaurantSchema.index({ ownerId: 1 })

// Virtual for checking if restaurant is currently open
restaurantSchema.virtual('isOpenNow').get(function() {
  const now = new Date()
  const currentDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()]
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

  const todayHours = this.operatingHours.find((h: IOperatingHour) => h.day === currentDay)
  if (!todayHours || !todayHours.isOpen) return false

  return currentTime >= todayHours.open && currentTime <= todayHours.close
})

// Static method to find nearby restaurants
restaurantSchema.statics.findNearby = function(longitude: number, latitude: number, maxDistance: number = 5000) {
  return this.find({
    'address.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance // in meters
      }
    },
    isActive: true
  })
}

// Static method to search restaurants
restaurantSchema.statics.searchRestaurants = function(query: string, filters: any = {}) {
  const searchQuery: any = {
    isActive: true,
    ...filters
  }

  if (query) {
    searchQuery.$or = [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { cuisine: { $in: [new RegExp(query, 'i')] } }
    ]
  }

  return this.find(searchQuery)
}

export const Restaurant = mongoose.model<IRestaurant>('Restaurant', restaurantSchema)
export default Restaurant