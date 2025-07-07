import { Router } from 'express'
import { adminAuth, requireRole } from '../middleware/admin'
import { logger } from '../utils/logger'
import { createClient } from '@supabase/supabase-js'

const router = Router()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// All routes require admin authentication
router.use(adminAuth)

// GET /api/admin/dashboard - Admin dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    // Get event counts by sport
    const { data: eventStats } = await supabase
      .from('events')
      .select('sport_id, sports(name), status')
      .order('sport_id')
    
    // Group by sport and status
    const stats = eventStats?.reduce((acc: any, event: any) => {
      const sportName = event.sports?.name || 'Unknown'
      if (!acc[sportName]) {
        acc[sportName] = {
          total: 0,
          scheduled: 0,
          live: 0,
          completed: 0,
          cancelled: 0
        }
      }
      acc[sportName].total++
      acc[sportName][event.status]++
      return acc
    }, {}) || {}
    
    // Get recent sync errors
    const { data: recentErrors } = await supabase
      .from('sync_errors')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    
    // Get admin activity
    const { data: adminCount } = await supabase
      .from('admins')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
    
    res.json({
      stats: {
        events: stats,
        totalEvents: eventStats?.length || 0,
        activeAdmins: adminCount || 0,
        recentErrors: recentErrors || []
      }
    })
  } catch (error) {
    logger.error('Error fetching dashboard stats:', error)
    res.status(500).json({ error: 'Failed to fetch dashboard stats' })
  }
})

// GET /api/admin/sync-status - Get detailed sync status
router.get('/sync-status', async (req, res) => {
  try {
    const { data: sports } = await supabase
      .from('sports')
      .select('*')
      .order('id')
    
    const syncStatus = await Promise.all(
      sports?.map(async (sport) => {
        // Get last successful sync
        const { data: lastSync } = await supabase
          .from('api_cache')
          .select('cached_at')
          .eq('sport_id', sport.id)
          .order('cached_at', { ascending: false })
          .limit(1)
          .single()
        
        // Get error count in last 24h
        const { count: errorCount } = await supabase
          .from('sync_errors')
          .select('*', { count: 'exact', head: true })
          .eq('sport_id', sport.id)
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        
        return {
          sport: sport.name,
          sportId: sport.id,
          lastSync: lastSync?.cached_at || null,
          errorCount24h: errorCount || 0,
          isHealthy: (errorCount || 0) < 5
        }
      }) || []
    )
    
    res.json({ syncStatus })
  } catch (error) {
    logger.error('Error fetching sync status:', error)
    res.status(500).json({ error: 'Failed to fetch sync status' })
  }
})

// POST /api/admin/clear-cache/:sportId - Clear cache for a sport
router.post('/clear-cache/:sportId', requireRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const { sportId } = req.params
    
    const { error } = await supabase
      .from('api_cache')
      .delete()
      .eq('sport_id', sportId)
    
    if (error) throw error
    
    logger.info(`Cache cleared for sport ${sportId} by admin ${req.admin?.email}`)
    
    res.json({ message: 'Cache cleared successfully' })
  } catch (error) {
    logger.error('Error clearing cache:', error)
    res.status(500).json({ error: 'Failed to clear cache' })
  }
})

// GET /api/admin/admins - List all admins (super_admin only)
router.get('/admins', requireRole(['super_admin']), async (req, res) => {
  try {
    const { data: admins, error } = await supabase
      .from('admins')
      .select('id, email, role, is_active, created_at, last_login')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    res.json({ admins })
  } catch (error) {
    logger.error('Error fetching admins:', error)
    res.status(500).json({ error: 'Failed to fetch admins' })
  }
})

// PATCH /api/admin/admins/:id - Update admin (super_admin only)
router.patch('/admins/:id', requireRole(['super_admin']), async (req, res) => {
  try {
    const { id } = req.params
    const { is_active, role } = req.body
    
    const updates: any = {}
    if (typeof is_active === 'boolean') updates.is_active = is_active
    if (role && ['admin', 'super_admin'].includes(role)) updates.role = role
    
    const { data, error } = await supabase
      .from('admins')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    logger.info(`Admin ${id} updated by ${req.admin?.email}`)
    
    res.json(data)
  } catch (error) {
    logger.error('Error updating admin:', error)
    res.status(500).json({ error: 'Failed to update admin' })
  }
})

export default router