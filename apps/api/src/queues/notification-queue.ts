import Bull from 'bull'
import { emailService } from '../services/email'
import { logger } from '../utils/logger'
import { createClient } from '@supabase/supabase-js'
import { addMinutes, subMinutes } from 'date-fns'
import { InMemoryQueue } from './in-memory-queue'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Create queue with or without Redis (fallback to in-memory)
let notificationQueue: Bull.Queue | InMemoryQueue<NotificationJob> | null = null
let useInMemoryQueue = false

// Try to initialize Bull queue with Redis
const initializeQueue = async () => {
  if (process.env.REDIS_URL || process.env.REDIS_HOST) {
    try {
      const bullQueue = new Bull('notifications', {
        redis: process.env.REDIS_URL ? process.env.REDIS_URL : {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
          password: process.env.REDIS_PASSWORD,
        },
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: false,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        },
      })

      // Test the connection
      await bullQueue.isReady()
      notificationQueue = bullQueue
      logger.info('Notification queue initialized with Redis')
      return
    } catch (error) {
      logger.warn('Failed to initialize Redis queue, falling back to in-memory queue')
    }
  }
  
  // Fallback to in-memory queue
  notificationQueue = new InMemoryQueue<NotificationJob>('notifications')
  useInMemoryQueue = true
  logger.info('Using in-memory notification queue')
}

// Initialize on module load
const queueReady = initializeQueue().then(() => {
  // Process notification jobs after queue is initialized
  if (notificationQueue) {
    if (useInMemoryQueue) {
      (notificationQueue as InMemoryQueue<NotificationJob>).process(processNotification)
    } else {
      (notificationQueue as Bull.Queue).process(async (job) => {
        await processNotification(job.data as NotificationJob)
      })
    }
  }
}).catch((error) => {
  logger.error('Failed to initialize notification queue:', error)
})

interface NotificationJob {
  type: 'email' | 'sms' | 'push'
  to: string
  data: {
    eventId: number
    eventName: string
    eventTime: Date
    eventLocation?: string
    reminderTime: number // minutes before event
  }
}

// Process notification jobs
const processNotification = async (jobData: NotificationJob) => {
  const { type, to, data } = jobData
  
  logger.info(`Processing ${type} notification for ${to}`)
  
  switch (type) {
    case 'email':
      const success = await emailService.sendEventReminder(
        to,
        data.eventName,
        new Date(data.eventTime),
        data.eventLocation
      )
      
      if (!success) {
        throw new Error('Failed to send email')
      }
      
      // Update reminder status
      await supabase
        .from('reminders')
        .update({ 
          last_sent_at: new Date().toISOString(),
          status: 'sent' 
        })
        .eq('event_id', data.eventId)
        .eq('channel', 'email')
      
      break
      
    case 'sms':
      // TODO: Implement SMS service
      logger.warn('SMS notifications not yet implemented')
      break
      
    case 'push':
      // TODO: Implement push notifications
      logger.warn('Push notifications not yet implemented')
      break
  }
}


// Schedule reminders for upcoming events
export async function scheduleEventReminders() {
  try {
    const now = new Date()
    const checkWindow = addMinutes(now, 120) // Check 2 hours ahead
    
    // Get active reminders for upcoming events
    const { data: reminders, error } = await supabase
      .from('reminders')
      .select(`
        *,
        events(
          id,
          title,
          start_time,
          location
        ),
        user_configs(
          user_id,
          device_id,
          user_email
        )
      `)
      .eq('is_active', true)
      .gte('events.start_time', now.toISOString())
      .lte('events.start_time', checkWindow.toISOString())
      .is('last_sent_at', null) // Not yet sent
    
    if (error) {
      logger.error('Error fetching reminders:', error)
      return
    }
    
    for (const reminder of reminders || []) {
      if (!reminder.events || !reminder.user_configs) continue
      
      const eventTime = new Date(reminder.events.start_time)
      const reminderTime = subMinutes(eventTime, reminder.minutes_before)
      
      // Skip if reminder time has passed
      if (reminderTime < now) continue
      
      const delay = reminderTime.getTime() - now.getTime()
      
      const jobData: NotificationJob = {
        type: reminder.type as 'email' | 'sms' | 'push',
        to: reminder.type === 'email' ? (reminder.user_configs.user_email || reminder.user_configs.user_id) : reminder.user_configs.user_id,
        data: {
          eventId: reminder.events.id,
          eventName: reminder.events.title,
          eventTime: eventTime,
          eventLocation: reminder.events.location,
          reminderTime: reminder.minutes_before
        }
      }
      
      if (notificationQueue) {
        // Add to queue with delay
        await notificationQueue.add(jobData, { delay })
        logger.info(`Scheduled ${reminder.channel} reminder for ${reminder.events.title} in ${Math.round(delay / 1000 / 60)} minutes`)
      } else {
        // Direct send if no queue (for development)
        logger.warn('Notification queue not available, skipping reminder')
      }
    }
    
    logger.info(`Scheduled ${reminders?.length || 0} reminders`)
  } catch (error) {
    logger.error('Error scheduling reminders:', error)
  }
}

// Run scheduler every 30 minutes
export function startReminderScheduler() {
  // Initial run
  scheduleEventReminders()
  
  // Schedule periodic runs
  setInterval(() => {
    scheduleEventReminders()
  }, 30 * 60 * 1000) // 30 minutes
  
  logger.info('Reminder scheduler started')
}

export { notificationQueue }