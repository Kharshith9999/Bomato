import { Server } from 'socket.io'

export const initializeSocket = (io: Server): void => {
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`)

    // Join user to their personal room for order updates
    socket.on('join-user-room', (userId: string) => {
      socket.join(`user_${userId}`)
      console.log(`User ${userId} joined their room`)
    })

    // Join restaurant staff to restaurant room for order updates
    socket.on('join-restaurant-room', (restaurantId: string) => {
      socket.join(`restaurant_${restaurantId}`)
      console.log(`Restaurant ${restaurantId} room joined`)
    })

    // Join specific order room for real-time tracking
    socket.on('join-order-room', (orderId: string) => {
      socket.join(`order_${orderId}`)
      console.log(`Order ${orderId} room joined`)
    })

    // Leave rooms on disconnect
    socket.on('leave-order-room', (orderId: string) => {
      socket.leave(`order_${orderId}`)
      console.log(`Left order ${orderId} room`)
    })

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`)
    })
  })

  // TODO: Implement order status updates
  // TODO: Implement delivery partner location updates
  // TODO: Implement restaurant order notifications

  console.log('Socket.io initialized for order tracking')
}