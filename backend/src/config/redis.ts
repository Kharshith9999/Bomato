import { createClient, RedisClientType } from 'redis'

let redisClient: RedisClientType

export const connectRedis = async (): Promise<RedisClientType> => {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'

    redisClient = createClient({
      url: redisUrl,
    })

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err)
    })

    redisClient.on('connect', () => {
      console.log('Redis Client Connected')
    })

    redisClient.on('ready', () => {
      console.log('Redis Client Ready')
    })

    await redisClient.connect()
    return redisClient
  } catch (error) {
    console.error('Redis connection error:', error)
    throw error
  }
}

export const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectRedis() first.')
  }
  return redisClient
}

export const disconnectRedis = async (): Promise<void> => {
  try {
    if (redisClient) {
      await redisClient.quit()
      console.log('Redis connection closed')
    }
  } catch (error) {
    console.error('Error closing Redis connection:', error)
    throw error
  }
}