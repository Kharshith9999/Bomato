import { ApiResponse, User, Restaurant, Order, Cart } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Add auth token if available
    const token = this.getToken()
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP error! status: ${response.status}`,
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      }
    }
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token')
    }
    return null
  }

  // Auth endpoints
  async register(userData: {
    name: string
    email: string
    phone: string
    password: string
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async login(credentials: {
    email: string
    password: string
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async logout(): Promise<ApiResponse<null>> {
    return this.request('/auth/logout', {
      method: 'POST',
    })
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request('/auth/me')
  }

  // Restaurant endpoints
  async getRestaurants(params?: {
    cuisine?: string
    lat?: number
    lng?: number
    radius?: number
  }): Promise<ApiResponse<Restaurant[]>> {
    const searchParams = new URLSearchParams(params as any).toString()
    return this.request(`/restaurants${searchParams ? `?${searchParams}` : ''}`)
  }

  async getRestaurant(id: string): Promise<ApiResponse<Restaurant>> {
    return this.request(`/restaurants/${id}`)
  }

  async getRestaurantMenu(id: string): Promise<ApiResponse<any>> {
    return this.request(`/restaurants/${id}/menu`)
  }

  // Order endpoints
  async createOrder(orderData: {
    restaurantId: string
    items: Array<{
      menuItemId: string
      quantity: number
      customizations?: string[]
    }>
    deliveryAddress: any
    paymentMethod: string
  }): Promise<ApiResponse<Order>> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  }

  async getOrders(): Promise<ApiResponse<Order[]>> {
    return this.request('/orders')
  }

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return this.request(`/orders/${id}`)
  }

  async updateOrderStatus(id: string, status: string): Promise<ApiResponse<Order>> {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }

  async cancelOrder(id: string, reason?: string): Promise<ApiResponse<Order>> {
    return this.request(`/orders/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
  }

  // User profile endpoints
  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  async addAddress(address: Omit<User['addresses'][0], '_id'>): Promise<ApiResponse<User>> {
    return this.request('/users/addresses', {
      method: 'POST',
      body: JSON.stringify(address),
    })
  }

  async updateAddress(id: string, address: Partial<User['addresses'][0]>): Promise<ApiResponse<User>> {
    return this.request(`/users/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(address),
    })
  }

  async deleteAddress(id: string): Promise<ApiResponse<User>> {
    return this.request(`/users/addresses/${id}`, {
      method: 'DELETE',
    })
  }
}

export const apiClient = new ApiClient(API_URL)
export default apiClient