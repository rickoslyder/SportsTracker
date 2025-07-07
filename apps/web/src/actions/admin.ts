'use server'

import { auth } from '@clerk/nextjs'
import { createClient } from '../lib/supabase/server'
import { startOfWeek, endOfWeek } from 'date-fns'

export async function getAdminStats() {
  const { userId } = auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = createClient()
  
  // Verify admin role
  const { data: userRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single()
    
  if (!userRole || userRole.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }
  const now = new Date()
  const weekStart = startOfWeek(now)
  const weekEnd = endOfWeek(now)

  // Get total events
  const { count: totalEvents } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })

  // Get total users (from user_configs)
  const { count: totalUsers } = await supabase
    .from('user_configs')
    .select('*', { count: 'exact', head: true })
    .not('user_id', 'is', null)

  // Get active reminders
  const { count: activeReminders } = await supabase
    .from('reminders')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  // Get events this week
  const { count: eventsThisWeek } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .gte('start_time', weekStart.toISOString())
    .lte('start_time', weekEnd.toISOString())

  return {
    totalEvents: totalEvents || 0,
    totalUsers: totalUsers || 0,
    activeReminders: activeReminders || 0,
    eventsThisWeek: eventsThisWeek || 0,
  }
}

export async function getRecentEvents(limit = 10) {
  const { userId } = auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = createClient()

  const { data: events } = await supabase
    .from('events')
    .select(`
      *,
      sports(name, slug)
    `)
    .order('created_at', { ascending: false })
    .limit(limit)

  return events || []
}

export async function getSystemHealth() {
  const { userId } = auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = createClient()

  // Get last sync times from api_cache
  const { data: lastSyncs } = await supabase
    .from('api_cache')
    .select('sport_id, cached_at')
    .order('cached_at', { ascending: false })

  // Group by sport to get latest sync for each
  const syncMap = new Map<number, string>()
  lastSyncs?.forEach(sync => {
    if (!syncMap.has(sync.sport_id)) {
      syncMap.set(sync.sport_id, sync.cached_at)
    }
  })

  // Get all sports
  const { data: sports } = await supabase
    .from('sports')
    .select('id, name')

  const health = sports?.map(sport => ({
    sportId: sport.id,
    sportName: sport.name,
    lastSync: syncMap.get(sport.id) || null,
    status: syncMap.has(sport.id) ? 'healthy' : 'warning'
  })) || []

  return health
}

export async function bulkUpdateEventStatus(
  eventIds: number[],
  status: 'scheduled' | 'live' | 'completed' | 'cancelled'
) {
  const { userId } = auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = createClient()

  const { error } = await supabase
    .from('events')
    .update({ status, updated_at: new Date().toISOString() })
    .in('id', eventIds)

  if (error) throw error

  return { success: true, updatedCount: eventIds.length }
}

export async function deleteEvent(eventId: number) {
  const { userId } = auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = createClient()

  // First delete related reminders
  await supabase
    .from('reminders')
    .delete()
    .eq('event_id', eventId)

  // Then delete the event
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId)

  if (error) throw error

  return { success: true }
}

export async function updateEvent(eventId: number, data: any) {
  const { userId } = auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = createClient()

  const { error } = await supabase
    .from('events')
    .update({
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq('id', eventId)

  if (error) throw error

  return { success: true }
}