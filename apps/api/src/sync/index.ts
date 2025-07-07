import { CronJob } from 'cron'
import { f1Sync } from './sports/f1'
import { formulaESync } from './sports/formula-e'
import { motoGPSync } from './sports/motogp'
import { ufcSync } from './sports/ufc'
import { wweSync } from './sports/wwe'
import { boxingSync } from './sports/boxing'
import { indycarSync } from './sports/indycar'
import { logger } from '../utils/logger'
import { redis } from '../lib/redis'

export interface SyncConfig {
  enabled: boolean
  schedule: string // Cron expression
  sportId: number
  name: string
  syncFunction: () => Promise<void>
}

const syncConfigs: SyncConfig[] = [
  {
    enabled: true,
    schedule: '0 */6 * * *', // Every 6 hours
    sportId: 1,
    name: 'Formula 1',
    syncFunction: f1Sync
  },
  {
    enabled: true,
    schedule: '0 */6 * * *',
    sportId: 2,
    name: 'Formula E',
    syncFunction: formulaESync
  },
  {
    enabled: true,
    schedule: '0 */8 * * *', // Every 8 hours
    sportId: 3,
    name: 'MotoGP',
    syncFunction: motoGPSync
  },
  {
    enabled: true,
    schedule: '0 */4 * * *', // Every 4 hours
    sportId: 4,
    name: 'UFC',
    syncFunction: ufcSync
  },
  {
    enabled: true,
    schedule: '0 */12 * * *', // Every 12 hours
    sportId: 5,
    name: 'WWE',
    syncFunction: wweSync
  },
  {
    enabled: true,
    schedule: '0 */6 * * *',
    sportId: 6,
    name: 'Boxing',
    syncFunction: boxingSync
  },
  {
    enabled: true,
    schedule: '0 */6 * * *',
    sportId: 7,
    name: 'IndyCar',
    syncFunction: indycarSync
  }
]

const jobs: CronJob[] = []

export function startSyncJobs() {
  logger.info('Starting API sync jobs...')

  for (const config of syncConfigs) {
    if (!config.enabled) {
      logger.info(`Sync for ${config.name} is disabled`)
      continue
    }

    const job = new CronJob(
      config.schedule,
      async () => {
        const lockKey = `sync:${config.sportId}:lock`
        const lockDuration = 300 // 5 minutes
        
        try {
          // Try to acquire lock if Redis is available
          let locked = false
          if (redis) {
            locked = await redis.set(lockKey, '1', 'EX', lockDuration, 'NX') === 'OK'
            
            if (!locked) {
              logger.warn(`Sync for ${config.name} is already running`)
              return
            }
          }

          logger.info(`Starting sync for ${config.name}`)
          const startTime = Date.now()
          
          await config.syncFunction()
          
          const duration = Date.now() - startTime
          logger.info(`Completed sync for ${config.name} in ${duration}ms`)
          
          // Store last sync time
          if (redis) {
            await redis.set(`sync:${config.sportId}:lastRun`, new Date().toISOString())
          }
          
        } catch (error) {
          logger.error(`Error syncing ${config.name}:`, error)
        } finally {
          // Release lock
          if (redis && locked) {
            await redis.del(lockKey)
          }
        }
      },
      null,
      true, // Start immediately
      'UTC'
    )

    jobs.push(job)
    logger.info(`Scheduled sync for ${config.name} with schedule: ${config.schedule}`)
  }

  // Run initial sync for all sports
  runInitialSync()
}

export function stopSyncJobs() {
  logger.info('Stopping API sync jobs...')
  
  for (const job of jobs) {
    job.stop()
  }
  
  jobs.length = 0
}

async function runInitialSync() {
  logger.info('Running initial sync for all sports...')
  
  for (const config of syncConfigs) {
    if (!config.enabled) continue
    
    try {
      logger.info(`Initial sync for ${config.name}`)
      await config.syncFunction()
    } catch (error) {
      logger.error(`Error in initial sync for ${config.name}:`, error)
    }
  }
}