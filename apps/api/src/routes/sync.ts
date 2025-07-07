import { Router } from 'express'
import { logger } from '../utils/logger'
import { redis } from '../lib/redis'
import { syncConfigs } from '../sync'
import { createClient } from '@supabase/supabase-js'

const router = Router()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Get sync status for all sports
router.get('/status', async (req, res) => {
  try {
    const statuses = await Promise.all(
      syncConfigs.map(async (config) => {
        const lastRun = redis ? await redis.get(`sync:${config.sportId}:lastRun`) : null
        const isLocked = redis ? await redis.get(`sync:${config.sportId}:lock`) : null
        
        // Get event count from database
        const { count } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('sport_id', config.sportId)
        
        return {
          sportId: config.sportId,
          name: config.name,
          enabled: config.enabled,
          schedule: config.schedule,
          lastRun: lastRun || null,
          isRunning: !!isLocked,
          eventCount: count || 0
        }
      })
    )
    
    res.json({ statuses })
  } catch (error) {
    logger.error('Error getting sync status:', error)
    res.status(500).json({ error: 'Failed to get sync status' })
  }
})

// Trigger manual sync for a specific sport
router.post('/trigger/:sportId', async (req, res) => {
  try {
    const sportId = parseInt(req.params.sportId)
    const config = syncConfigs.find(c => c.sportId === sportId)
    
    if (!config) {
      return res.status(404).json({ error: 'Sport not found' })
    }
    
    const lockKey = `sync:${sportId}:lock`
    let locked = false
    
    if (redis) {
      locked = await redis.set(lockKey, '1', 'EX', 300, 'NX') === 'OK'
      
      if (!locked) {
        return res.status(409).json({ error: 'Sync already in progress' })
      }
    }
    
    // Run sync in background
    config.syncFunction()
      .then(() => {
        logger.info(`Manual sync completed for ${config.name}`)
        if (redis) {
          redis.set(`sync:${sportId}:lastRun`, new Date().toISOString())
        }
      })
      .catch((error) => {
        logger.error(`Manual sync failed for ${config.name}:`, error)
      })
      .finally(() => {
        if (redis && locked) {
          redis.del(lockKey)
        }
      })
    
    res.json({ 
      message: `Sync triggered for ${config.name}`,
      sportId,
      name: config.name 
    })
  } catch (error) {
    logger.error('Error triggering sync:', error)
    res.status(500).json({ error: 'Failed to trigger sync' })
  }
})

// Get recent API cache entries
router.get('/cache/:sportId', async (req, res) => {
  try {
    const sportId = parseInt(req.params.sportId)
    const limit = parseInt(req.query.limit as string) || 10
    
    const { data, error } = await supabase
      .from('api_cache')
      .select('*')
      .eq('sport_id', sportId)
      .order('cached_at', { ascending: false })
      .limit(limit)
    
    if (error) {
      throw error
    }
    
    res.json({ cache: data })
  } catch (error) {
    logger.error('Error fetching cache:', error)
    res.status(500).json({ error: 'Failed to fetch cache' })
  }
})

// Get sync logs
router.get('/logs', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50
    const sportId = req.query.sportId ? parseInt(req.query.sportId as string) : undefined
    
    // In a real implementation, you'd fetch from a logs table
    // For now, return a simple response
    res.json({ 
      logs: [],
      message: 'Logs endpoint not fully implemented yet'
    })
  } catch (error) {
    logger.error('Error fetching logs:', error)
    res.status(500).json({ error: 'Failed to fetch logs' })
  }
})

export default router