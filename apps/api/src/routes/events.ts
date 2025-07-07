import { Router } from 'express'
import { logger } from '../utils/logger'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { adminAuth } from '../middleware/admin'

const router = Router()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Validation schemas
const eventUpdateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  start_time: z.string().datetime().optional(),
  end_time: z.string().datetime().nullable().optional(),
  location: z.string().max(255).nullable().optional(),
  venue: z.string().max(255).nullable().optional(),
  status: z.enum(['scheduled', 'live', 'completed', 'cancelled']).optional(),
  timezone: z.string().optional(),
  metadata: z.record(z.any()).optional(),
})

const eventFiltersSchema = z.object({
  sport_id: z.string().regex(/^\d+$/).optional(),
  status: z.enum(['scheduled', 'live', 'completed', 'cancelled']).optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  search: z.string().optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  offset: z.string().regex(/^\d+$/).optional(),
})

// GET /api/events - List all events with filtering
router.get('/', async (req, res) => {
  try {
    const filters = eventFiltersSchema.parse(req.query)
    
    let query = supabase
      .from('events')
      .select(`
        *,
        sports(name, slug),
        home_team:teams!events_home_team_id_fkey(name, logo_url),
        away_team:teams!events_away_team_id_fkey(name, logo_url)
      `)
      .order('start_time', { ascending: true })
    
    // Apply filters
    if (filters.sport_id) {
      query = query.eq('sport_id', parseInt(filters.sport_id))
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters.start_date) {
      query = query.gte('start_time', filters.start_date)
    }
    
    if (filters.end_date) {
      query = query.lte('start_time', filters.end_date)
    }
    
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,location.ilike.%${filters.search}%,venue.ilike.%${filters.search}%`)
    }
    
    // Pagination
    const limit = parseInt(filters.limit || '50')
    const offset = parseInt(filters.offset || '0')
    query = query.range(offset, offset + limit - 1)
    
    const { data, error, count } = await query
    
    if (error) {
      throw error
    }
    
    res.json({
      events: data,
      pagination: {
        total: count,
        limit,
        offset,
      }
    })
  } catch (error) {
    logger.error('Error fetching events:', error)
    res.status(500).json({ error: 'Failed to fetch events' })
  }
})

// GET /api/events/:id - Get single event
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        sports(name, slug),
        home_team:teams!events_home_team_id_fkey(name, logo_url),
        away_team:teams!events_away_team_id_fkey(name, logo_url)
      `)
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Event not found' })
      }
      throw error
    }
    
    res.json(data)
  } catch (error) {
    logger.error('Error fetching event:', error)
    res.status(500).json({ error: 'Failed to fetch event' })
  }
})

// PUT /api/events/:id - Update event (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params
    const updates = eventUpdateSchema.parse(req.body)
    
    // Check if event exists
    const { data: existingEvent } = await supabase
      .from('events')
      .select('id')
      .eq('id', id)
      .single()
    
    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' })
    }
    
    // Update event
    const { data, error } = await supabase
      .from('events')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      throw error
    }
    
    // Log the update
    logger.info(`Event ${id} updated by admin ${req.admin?.email}`)
    
    res.json(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors })
    }
    
    logger.error('Error updating event:', error)
    res.status(500).json({ error: 'Failed to update event' })
  }
})

// DELETE /api/events/:id - Delete event (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params
    
    // Check if event exists
    const { data: existingEvent } = await supabase
      .from('events')
      .select('id, title')
      .eq('id', id)
      .single()
    
    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' })
    }
    
    // Delete event
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
    
    if (error) {
      throw error
    }
    
    // Log the deletion
    logger.info(`Event ${id} (${existingEvent.title}) deleted by admin ${req.admin?.email}`)
    
    res.json({ message: 'Event deleted successfully' })
  } catch (error) {
    logger.error('Error deleting event:', error)
    res.status(500).json({ error: 'Failed to delete event' })
  }
})

// PATCH /api/events/:id/status - Update event status (admin only)
router.patch('/:id/status', adminAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    
    if (!['scheduled', 'live', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }
    
    const { data, error } = await supabase
      .from('events')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Event not found' })
      }
      throw error
    }
    
    logger.info(`Event ${id} status updated to ${status} by admin ${req.admin?.email}`)
    
    res.json(data)
  } catch (error) {
    logger.error('Error updating event status:', error)
    res.status(500).json({ error: 'Failed to update event status' })
  }
})

// POST /api/events/bulk-update - Bulk update events (admin only)
router.post('/bulk-update', adminAuth, async (req, res) => {
  try {
    const { ids, updates } = req.body
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Invalid event IDs' })
    }
    
    const validatedUpdates = eventUpdateSchema.parse(updates)
    
    const { data, error } = await supabase
      .from('events')
      .update({
        ...validatedUpdates,
        updated_at: new Date().toISOString()
      })
      .in('id', ids)
      .select()
    
    if (error) {
      throw error
    }
    
    logger.info(`${data.length} events bulk updated by admin ${req.admin?.email}`)
    
    res.json({
      message: `${data.length} events updated successfully`,
      updated: data
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors })
    }
    
    logger.error('Error bulk updating events:', error)
    res.status(500).json({ error: 'Failed to bulk update events' })
  }
})

export default router