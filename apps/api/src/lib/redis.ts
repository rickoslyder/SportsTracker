import Redis from 'ioredis'
import { logger } from '../utils/logger'

let redis: Redis | null = null

// Only initialize Redis if URL is provided
if (process.env.REDIS_URL) {
  try {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      retryStrategy: () => null, // Don't retry, just fail
      reconnectOnError: () => false,
    })

    redis.on('connect', () => {
      logger.info('Redis connected successfully')
    })

    redis.on('error', (error) => {
      // Silence connection errors if Redis is not configured
      if (error.code !== 'ECONNREFUSED') {
        logger.error('Redis error:', error.message)
      }
    })

    redis.on('close', () => {
      // Only log if we had a connection before
      if (redis?.status === 'ready') {
        logger.warn('Redis connection closed')
      }
    })

    // Graceful shutdown
    process.on('SIGINT', async () => {
      if (redis) {
        await redis.quit()
        logger.info('Redis connection closed through app termination')
      }
      process.exit(0)
    })
  } catch (error) {
    logger.warn('Redis initialization failed, some features may be limited')
    redis = null
  }
} else {
  logger.info('Redis URL not configured, caching disabled')
}

// Export a wrapper that handles null redis
export { redis }