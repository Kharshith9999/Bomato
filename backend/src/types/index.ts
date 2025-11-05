import { Document, Types } from 'mongoose'

// Base interface for MongoDB documents
export interface BaseDocument extends Document {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

// User interface
export interface IUser extends BaseDocument {
  email: string
  phone: string
  name: string
  avatar?: string
  addresses: IAddress[]
  preferences: IUserPreferences
  emailVerified: boolean
  phoneVerified: boolean
  password: string
}

export interface IAddress {
  type: 'home' | 'work' | 'other'
  street: string
  city: string
  state: string
  postalCode: string
  coordinates: [number, number] // [longitude, latitude]
  isDefault: boolean
}

export interface IUserPreferences {
  cuisine: string[]
  dietaryRestrictions: string[]
  defaultPaymentMethod?: string
}

// Restaurant interface
export interface IRestaurant extends BaseDocument {
  name: string
  description: string
  cuisine: string[]
  address: IAddress
  contact: {
    phone: string
    email: string
  }
  images: string[]
  rating: number
  reviewCount: number
  deliveryInfo: IDeliveryInfo
  operatingHours: IOperatingHour[]
  isActive: boolean
  ownerId: Types.ObjectId
}

export interface IDeliveryInfo {
  avgDeliveryTime: number // in minutes
  deliveryFee: number
  minOrderAmount: number
  freeDeliveryAbove: number
}

export interface IOperatingHour {
  day: string // Monday, Tuesday, etc.
  open: string // HH:MM format
  close: string // HH:MM format
  isOpen: boolean
}

// Menu interface
export interface IMenu extends BaseDocument {
  restaurantId: Types.ObjectId
  categories: IMenuCategory[]
}

export interface IMenuCategory {
  name: string
  items: IMenuItem[]
}

export interface IMenuItem {
  name: string
  description: string
  price: number
  image?: string
  isAvailable: boolean
  isPopular: boolean
  preparationTime: number // in minutes
  dietaryInfo: string[]
}

// Order interface
export interface IOrder extends BaseDocument {
  orderNumber: string
  customerId: Types.ObjectId
  restaurantId: Types.ObjectId
  deliveryAddress: IAddress
  items: IOrderItem[]
  pricing: IOrderPricing
  payment: IOrderPayment
  status: IOrderStatus
  timeline: IOrderTimeline[]
  deliveryPartner?: IDeliveryPartner
  estimatedDeliveryTime: Date
  actualDeliveryTime?: Date
}

export interface IOrderItem {
  menuItemId: Types.ObjectId
  name: string
  price: number
  quantity: number
  dietaryInfo: string[]
  customizations?: string[]
}

export interface IOrderPricing {
  subtotal: number
  deliveryFee: number
  taxes: number
  tip: number
  total: number
}

export interface IOrderPayment {
  method: 'card' | 'wallet' | 'cod'
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  stripePaymentIntentId?: string
}

export interface IOrderStatus {
  current: 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'picked_up' | 'on_the_way' | 'delivered' | 'cancelled'
  timestamp: Date
  notes?: string
}

export interface IOrderTimeline {
  status: string
  timestamp: Date
  updatedBy: Types.ObjectId // references User or Restaurant
  notes?: string
}

export interface IDeliveryPartner {
  partnerId: Types.ObjectId
  name: string
  phone: string
  vehicleDetails: string
  currentLocation: [number, number] // [longitude, latitude]
}

// Delivery interface
export interface IDelivery extends BaseDocument {
  orderId: Types.ObjectId
  deliveryService: string // doordash, uber, postmates
  externalDeliveryId: string
  status: 'requested' | 'confirmed' | 'picked_up' | 'in_progress' | 'delivered' | 'cancelled'
  pickupDetails: {
    address: IAddress
    contactName: string
    contactPhone: string
    instructions: string
  }
  dropoffDetails: {
    address: IAddress
    contactName: string
    contactPhone: string
    instructions: string
  }
  tracking: {
    trackingUrl?: string
    realTimeTracking: boolean
    estimatedDeliveryTime?: Date
    deliveryPartner?: {
      name: string
      phone: string
      vehicle: string
    }
  }
  pricing: {
    deliveryFee: number
    tip: number
    total: number
    currency: string
  }
}

// API Response interface
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// JWT Payload interface
export interface IJwtPayload {
  userId: string
  email: string
  type: 'access' | 'refresh'
}

// Socket.io event interfaces
export interface OrderStatusUpdateEvent {
  orderId: string
  status: string
  timestamp: Date
  estimatedTime?: number
  notes?: string
}

export interface DeliveryLocationUpdateEvent {
  orderId: string
  partnerLocation: [number, number]
  eta: number
}

// Request extensions
export interface AuthenticatedRequest extends Request {
  user?: IUser
}