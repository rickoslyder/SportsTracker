import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { logger, loggerStream } from './utils/logger'
import { startSyncJobs, stopSyncJobs } from './sync'
import { startReminderScheduler } from './queues/notification-queue'
import syncRoutes from './routes/sync'
import eventRoutes from './routes/events'
import adminRoutes from './routes/admin'

const app = express()
const PORT = process.env.PORT || 3001

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.NEXT_PUBLIC_APP_URL || 'https://sportstracker.com']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200
}

// Middleware
app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json())
app.use(morgan('combined', { stream: loggerStream }))
app.use('/api/', limiter) // Apply rate limiting to API routes

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Routes
app.use('/api/sync', syncRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/admin', adminRoutes)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

// Start server
const server = app.listen(PORT, () => {
  logger.info(`API server running on port ${PORT}`)
  
  // Start sync jobs
  if (process.env.ENABLE_SYNC !== 'false') {
    startSyncJobs()
  } else {
    logger.info('Sync jobs disabled by environment variable')
  }
  
  // Start reminder scheduler
  if (process.env.ENABLE_NOTIFICATIONS !== 'false') {
    startReminderScheduler()
  } else {
    logger.info('Notification scheduler disabled by environment variable')
  }
})

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully')
  
  // Stop sync jobs
  stopSyncJobs()
  
  // Close server
  server.close(() => {
    logger.info('Server closed')
    process.exit(0)
  })
})