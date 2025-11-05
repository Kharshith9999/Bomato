export interface User {
  _id: string
  email: string
  phone: string
  name: string
  avatar?: string
  addresses: Address[]
  preferences: UserPreferences
  createdAt: string
  updatedAt: string
}

export interface Address {
  type: 'home' | 'work' | 'other'
  street: string
  city: string
  state: string
  postalCode: string
  coordinates: [number, number]
  isDefault: boolean
}

export interface UserPreferences {
  cuisine: string[]
  dietaryRestrictions: string[]
  defaultPaymentMethod?: string
}

export interface Restaurant {
  _id: string
  name: string
  description: string
  cuisine: string[]
  address: Address
  contact: {
    phone: string
    email: string
  }
  images: string[]
  rating: number
  reviewCount: number
  deliveryInfo: DeliveryInfo
  operatingHours: OperatingHour[]
  isActive: boolean
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface DeliveryInfo {
  avgDeliveryTime: number
  deliveryFee: number
  minOrderAmount: number
  freeDeliveryAbove: number
}

export interface OperatingHour {
  day: string
  open: string
  close: string
  isOpen: boolean
}

export interface Menu {
  _id: string
  restaurantId: string
  categories: MenuCategory[]
  lastUpdated: string
}

export interface MenuCategory {
  name: string
  items: MenuItem[]
}

export interface MenuItem {
  _id: string
  name: string
  description: string
  price: number
  image?: string
  isAvailable: boolean
  isPopular: boolean
  preparationTime: number
  dietaryInfo: string[]
}

export interface Order {
  _id: string
  orderNumber: string
  customerId: string
  restaurantId: string
  deliveryAddress: Address
  items: OrderItem[]
  pricing: OrderPricing
  payment: OrderPayment
  status: OrderStatus
  timeline: OrderTimeline[]
  deliveryPartner?: DeliveryPartner
  estimatedDeliveryTime: string
  actualDeliveryTime?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  menuItemId: string
  name: string
  price: number
  quantity: number
  dietaryInfo: string[]
}

export interface OrderPricing {
  subtotal: number
  deliveryFee: number
  taxes: number
  tip: number
  total: number
}

export interface OrderPayment {
  method: 'card' | 'wallet' | 'cod'
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  stripePaymentIntentId?: string
}

export interface OrderStatus {
  current: 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'picked_up' | 'on_the_way' | 'delivered' | 'cancelled'
  timestamp: string
  notes?: string
}

export interface OrderTimeline {
  status: string
  timestamp: string
  updatedBy: string
  notes?: string
}

export interface DeliveryPartner {
  partnerId: string
  name: string
  phone: string
  vehicleDetails: string
  currentLocation: [number, number]
}

export interface CartItem extends OrderItem {
  customizations?: string[]
}

export interface Cart {
  items: CartItem[]
  restaurantId: string
  subtotal: number
  deliveryFee: number
  taxes: number
  total: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}