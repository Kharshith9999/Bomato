# Bomato - Food Delivery Platform

A comprehensive food delivery and restaurant discovery platform similar to Zomato, built with Next.js, Express, MongoDB, and TypeScript.

## 🚀 Project Overview

Bomato is a full-stack food delivery application that allows users to:
- Discover restaurants near them
- Browse menus and place orders
- Track orders in real-time
- Manage their profiles and addresses
- Enjoy seamless payment processing

## 🏗️ Architecture

### Frontend (Next.js 14)
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: Ready for Zustand integration
- **Maps**: Google Maps API (planned)

### Backend (Node.js + Express)
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based auth system
- **Real-time**: Socket.io for order tracking
- **Cache**: Redis for session management
- **Validation**: Comprehensive input validation

### Key Features Implemented

#### ✅ Core Foundation
- [x] Next.js 14 frontend with TypeScript
- [x] Express backend with TypeScript
- [x] MongoDB database with comprehensive models
- [x] Redis integration for caching
- [x] Environment configuration

#### ✅ Authentication System
- [x] User registration with email/phone verification
- [x] Secure login with JWT access/refresh tokens
- [x] Password hashing with bcrypt
- [x] Protected API routes with middleware
- [x] Profile management
- [x] Password change functionality

#### ✅ Database Models
- [x] User model with addresses and preferences
- [x] Restaurant model with operating hours and delivery info
- [x] Menu model with categories and items
- [x] Order model with comprehensive status tracking
- [x] Geospatial indexes for location-based queries

#### ✅ API Infrastructure
- [x] RESTful API design
- [x] Comprehensive error handling
- [x] Input validation and sanitization
- [x] Rate limiting
- [x] CORS configuration
- [x] Security headers with Helmet

#### ✅ Frontend Components
- [x] Responsive homepage with hero section
- [x] Authentication pages (Login/Register)
- [x] Restaurant listing with search and filters
- [x] TypeScript interfaces for API responses
- [x] API client with token management

#### ✅ Real-time Features
- [x] Socket.io integration for order tracking
- [x] Room-based communication for users/restaurants

## 📁 Project Structure

```
Bomato/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js 14 App Router pages
│   │   ├── components/      # Reusable UI components
│   │   ├── lib/             # Utility functions and API client
│   │   ├── types/           # TypeScript type definitions
│   │   └── globals.css      # Global styles with Tailwind
│   ├── package.json
│   └── next.config.js
├── backend/                  # Express.js backend API
│   ├── src/
│   │   ├── config/          # Database and Redis configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Authentication, validation, error handling
│   │   ├── models/          # Mongoose database models
│   │   ├── routes/          # API route definitions
│   │   ├── socket/          # Socket.io real-time features
│   │   ├── types/           # TypeScript interfaces
│   │   └── index.ts         # Main application entry point
│   ├── package.json
│   └── tsconfig.json
├── .gitignore
└── README.md
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- Redis
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Bomato
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Environment Configuration**

   Backend (copy `.env.example` to `.env`):
   ```env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/bomato
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your_jwt_secret_here
   STRIPE_SECRET_KEY=your_stripe_key
   # ... other environment variables
   ```

   Frontend (create `.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   ```

5. **Start development servers**

   Backend:
   ```bash
   cd backend
   npm run dev
   ```

   Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## 📊 Database Schema

### User Model
- Personal information (name, email, phone)
- Address management with geospatial coordinates
- Dietary preferences and cuisine preferences
- Email/phone verification status

### Restaurant Model
- Restaurant details and contact information
- Operating hours and availability
- Delivery information (fees, time estimates)
- Rating and review system
- Geospatial location for proximity searches

### Menu Model
- Hierarchical menu structure (categories → items)
- Item availability and pricing
- Dietary information and preparation time
- Popular item indicators

### Order Model
- Comprehensive order status tracking
- Real-time timeline updates
- Delivery partner information
- Payment processing details
- Customer and restaurant references

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Token refresh
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Restaurants
- `GET /api/restaurants` - List restaurants (with filters)
- `GET /api/restaurants/:id` - Get restaurant details
- `GET /api/restaurants/:id/menu` - Get restaurant menu

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders/:id/cancel` - Cancel order

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET|POST|PUT|DELETE /api/users/addresses` - Address management

## 🚧 Future Enhancements

### Payment Integration
- Stripe payment processing
- Wallet system
- Refund management

### Delivery Integration
- Third-party delivery services (Uber Direct, DoorDash)
- Real-time delivery tracking
- Delivery partner management

### Advanced Features
- Restaurant owner dashboard
- Advanced search and filtering
- Reviews and rating system
- Push notifications
- Analytics and reporting

## 🧪 Testing

The project includes comprehensive validation and error handling. Future versions will include:
- Unit tests with Jest
- Integration tests
- End-to-end tests with Cypress

## 📱 Mobile App

The backend API is designed to support mobile applications. Future development can include React Native or Flutter mobile apps.

## 🔒 Security Features

- JWT-based authentication with access/refresh tokens
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS configuration
- Security headers with Helmet
- SQL injection prevention with Mongoose

## 📈 Performance Optimizations

- MongoDB indexes for optimal query performance
- Redis caching for session management
- Image optimization with Next.js
- Code splitting and lazy loading
- Efficient database queries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For questions and support, please open an issue in the repository.

---

Built with ❤️ using Next.js, Express, MongoDB, and TypeScript