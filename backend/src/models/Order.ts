import mongoose, { Schema } from 'mongoose'
import { IOrder, IOrderItem, IOrderPricing, IOrderPayment, IOrderStatus, IOrderTimeline, IDeliveryPartner } from '@/types'

const orderItemSchema = new Schema<IOrderItem>({
  menuItemId: {
    type: Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: [true, 'Menu item ID is required']
  },
  name: {
    type: String,
    required: [true, 'Item name is required']
  },
  price: {
    type: Number,
    required: [true, 'Item price is required'],
    min: [0, 'Price cannot be negative']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  dietaryInfo: [{
    type: String
  }],
  customizations: [{
    type: String
  }]
}, { _id: false })

const orderPricingSchema = new Schema<IOrderPricing>({
  subtotal: {
    type: Number,
    required: [true, 'Subtotal is required'],
    min: [0, 'Subtotal cannot be negative']
  },
  deliveryFee: {
    type: Number,
    required: [true, 'Delivery fee is required'],
    min: [0, 'Delivery fee cannot be negative']
  },
  taxes: {
    type: Number,
    required: [true, 'Taxes are required'],
    min: [0, 'Taxes cannot be negative']
  },
  tip: {
    type: Number,
    default: 0,
    min: [0, 'Tip cannot be negative']
  },
  total: {
    type: Number,
    required: [true, 'Total is required'],
    min: [0, 'Total cannot be negative']
  }
}, { _id: false })

const orderPaymentSchema = new Schema<IOrderPayment>({
  method: {
    type: String,
    enum: ['card', 'wallet', 'cod'],
    required: [true, 'Payment method is required']
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  stripePaymentIntentId: {
    type: String,
    sparse: true
  }
}, { _id: false })

const orderStatusSchema = new Schema<IOrderStatus>({
  current: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'picked_up', 'on_the_way', 'delivered', 'cancelled'],
    required: [true, 'Order status is required']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: [500, 'Status notes cannot exceed 500 characters']
  }
}, { _id: false })

const orderTimelineSchema = new Schema<IOrderTimeline>({
  status: {
    type: String,
    required: [true, 'Timeline status is required']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Updated by is required']
  },
  notes: {
    type: String,
    maxlength: [500, 'Timeline notes cannot exceed 500 characters']
  }
}, { _id: false })

const deliveryPartnerSchema = new Schema<IDeliveryPartner>({
  partnerId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: [true, 'Delivery partner name is required']
  },
  phone: {
    type: String,
    required: [true, 'Delivery partner phone is required'],
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
  },
  vehicleDetails: {
    type: String,
    required: [true, 'Vehicle details are required']
  },
  currentLocation: {
    type: [Number], // [longitude, latitude]
    validate: {
      validator: function(coords: number[]) {
        return coords.length === 2 && coords.every(coord => typeof coord === 'number')
      },
      message: 'Coordinates must be an array of two numbers [longitude, latitude]'
    }
  }
}, { _id: false })

const orderSchema = new Schema<IOrder>({
  orderNumber: {
    type: String,
    required: [true, 'Order number is required'],
    unique: true
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer ID is required']
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Restaurant ID is required']
  },
  deliveryAddress: {
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
    required: [true, 'Delivery address is required']
  },
  items: {
    type: [orderItemSchema],
    required: [true, 'Order items are required'],
    validate: {
      validator: function(items: IOrderItem[]) {
        return items.length > 0
      },
      message: 'Order must contain at least one item'
    }
  },
  pricing: {
    type: orderPricingSchema,
    required: [true, 'Order pricing is required']
  },
  payment: {
    type: orderPaymentSchema,
    required: [true, 'Payment information is required']
  },
  status: {
    type: orderStatusSchema,
    required: [true, 'Order status is required']
  },
  timeline: {
    type: [orderTimelineSchema],
    default: []
  },
  deliveryPartner: {
    type: deliveryPartnerSchema,
    default: null
  },
  estimatedDeliveryTime: {
    type: Date,
    required: [true, 'Estimated delivery time is required']
  },
  actualDeliveryTime: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes for better performance
orderSchema.index({ orderNumber: 1 }, { unique: true })
orderSchema.index({ customerId: 1 })
orderSchema.index({ restaurantId: 1 })
orderSchema.index({ 'status.current': 1 })
orderSchema.index({ createdAt: -1 })
orderSchema.index({ estimatedDeliveryTime: 1 })

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const count = await this.constructor.countDocuments()
      this.orderNumber = `BMT-${String(count + 1).padStart(6, '0')}`
    } catch (error) {
      // Fallback to timestamp-based order number
      this.orderNumber = `BMT-${Date.now()}`
    }
  }
  next()
})

// Pre-save middleware to update timeline when status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('status.current')) {
    const timelineEntry: IOrderTimeline = {
      status: this.status.current,
      timestamp: new Date(),
      updatedBy: this.customerId,
      notes: this.status.notes
    }

    // Check if this status already exists in timeline
    const existingIndex = this.timeline.findIndex(t => t.status === this.status.current)
    if (existingIndex >= 0) {
      this.timeline[existingIndex] = timelineEntry
    } else {
      this.timeline.push(timelineEntry)
    }
  }
  next()
})

// Static method to find customer orders
orderSchema.statics.findByCustomer = function(customerId: string, limit: number = 10) {
  return this.find({ customerId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('restaurantId', 'name images')
}

// Static method to find restaurant orders
orderSchema.statics.findByRestaurant = function(restaurantId: string, status?: string) {
  const query: any = { restaurantId }
  if (status) {
    query['status.current'] = status
  }
  return this.find(query)
    .sort({ createdAt: -1 })
    .populate('customerId', 'name phone')
}

// Instance method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function(): boolean {
  const cancelableStatuses = ['pending', 'confirmed']
  return cancelableStatuses.includes(this.status.current)
}

export const Order = mongoose.model<IOrder>('Order', orderSchema)
export default Order