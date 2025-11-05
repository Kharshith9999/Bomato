'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Mock data for restaurants
const mockRestaurants = [
  {
    id: 1,
    name: "Bella Italia",
    cuisine: ["Italian", "Pizza"],
    rating: 4.5,
    reviewCount: 128,
    deliveryTime: "30-40 min",
    deliveryFee: 2.99,
    image: "/api/placeholder/300/200",
    description: "Authentic Italian cuisine and wood-fired pizzas"
  },
  {
    id: 2,
    name: "Sushi Master",
    cuisine: ["Japanese", "Sushi"],
    rating: 4.8,
    reviewCount: 89,
    deliveryTime: "25-35 min",
    deliveryFee: 3.99,
    image: "/api/placeholder/300/200",
    description: "Fresh sushi and Japanese specialties"
  },
  {
    id: 3,
    name: "Burger Palace",
    cuisine: ["American", "Burgers"],
    rating: 4.2,
    reviewCount: 203,
    deliveryTime: "20-30 min",
    deliveryFee: 1.99,
    image: "/api/placeholder/300/200",
    description: "Gourmet burgers and American classics"
  },
  {
    id: 4,
    name: "Spice Garden",
    cuisine: ["Indian", "Asian"],
    rating: 4.6,
    reviewCount: 156,
    deliveryTime: "35-45 min",
    deliveryFee: 2.49,
    image: "/api/placeholder/300/200",
    description: "Traditional Indian dishes and curries"
  }
]

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState('all')

  const filteredRestaurants = mockRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCuisine = selectedCuisine === 'all' || restaurant.cuisine.includes(selectedCuisine)
    return matchesSearch && matchesCuisine
  })

  const allCuisines = Array.from(new Set(mockRestaurants.flatMap(r => r.cuisine)))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Bomato</h1>
            </Link>
            <nav className="flex items-center space-x-4">
              <Link href="/orders" className="text-gray-600 hover:text-gray-900">
                Orders
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-gray-900">
                Profile
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Search and Filter Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search restaurants or cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Cuisines</option>
              {allCuisines.map(cuisine => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredRestaurants.length} Restaurants Found
          </h2>
          <p className="text-gray-600 mt-1">Discover amazing food near you</p>
        </div>

        {/* Restaurant Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map(restaurant => (
            <Link
              key={restaurant.id}
              href={`/restaurants/${restaurant.id}`}
              className="restaurant-card group"
            >
              <div className="aspect-video bg-gray-200 relative overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-lg text-sm font-medium shadow-sm">
                  {restaurant.deliveryTime}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {restaurant.name}
                  </h3>
                  <div className="flex items-center bg-green-50 px-2 py-1 rounded-lg">
                    <svg className="w-4 h-4 text-green-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-green-700 font-medium text-sm">{restaurant.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3">{restaurant.description}</p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex flex-wrap gap-1">
                    {restaurant.cuisine.map((cuisine, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                        {cuisine}
                      </span>
                    ))}
                  </div>
                  <div className="text-gray-500">
                    ${restaurant.deliveryFee} delivery
                  </div>
                </div>

                <div className="text-xs text-gray-500 mt-2">
                  {restaurant.reviewCount} reviews
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No restaurants found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}