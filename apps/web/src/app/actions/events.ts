'use server'

import { createClient } from '../../lib/supabase/server'
import { Database } from '@sports-tracker/types'
import { revalidatePath } from 'next/cache'

type Event = Database['public']['Tables']['events']['Row']
type EventWithSport = Event & {
  sport: Database['public']['Tables']['sports']['Row']
}

export async function getEvents(options: {
  sports?: string[]
  status?: string[]
  startDate?: Date
  endDate?: Date
  search?: string
  limit?: number
  offset?: number
} = {}) {
  const supabase = await createClient()
  
  let query = supabase
    .from('events')
    .select(`
      *,
      sport:sports!inner(*)
    `)
    .order('start_time', { ascending: true })
    .limit(options.limit || 50)
  
  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 50) - 1)
  }
  
  // Apply filters
  if (options.sports && options.sports.length > 0) {
    query = query.in('sport.slug', options.sports)
  }
  
  if (options.status && options.status.length > 0) {
    query = query.in('status', options.status)
  }
  
  if (options.startDate) {
    query = query.gte('start_time', options.startDate.toISOString())
  }
  
  if (options.endDate) {
    query = query.lte('start_time', options.endDate.toISOString())
  }
  
  if (options.search) {
    query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  
  return data as EventWithSport[]
}

export async function getEvent(eventId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      sport:sports!inner(*),
      teams:event_teams(
        team:teams(*)
      ),
      results:event_results(*)
    `)
    .eq('id', eventId)
    .single()
  
  if (error) throw error
  
  return data
}

export async function getUpcomingEvents(sportIds?: number[], limit = 10) {
  const supabase = await createClient()
  
  let query = supabase
    .from('events')
    .select(`
      *,
      sport:sports!inner(*)
    `)
    .gte('start_time', new Date().toISOString())
    .eq('status', 'scheduled')
    .order('start_time', { ascending: true })
    .limit(limit)
  
  if (sportIds && sportIds.length > 0) {
    query = query.in('sport_id', sportIds)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  
  return data as EventWithSport[]
}

export async function getPastEvents(sportIds?: number[], limit = 10) {
  const supabase = await createClient()
  
  let query = supabase
    .from('events')
    .select(`
      *,
      sport:sports!inner(*),
      results:event_results(*)
    `)
    .lt('start_time', new Date().toISOString())
    .in('status', ['finished', 'cancelled'])
    .order('start_time', { ascending: false })
    .limit(limit)
  
  if (sportIds && sportIds.length > 0) {
    query = query.in('sport_id', sportIds)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  
  return data
}

export async function refreshEvents() {
  revalidatePath('/events')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function getEventResults(eventId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('event_results')
    .select(`
      *,
      team:teams(*)
    `)
    .eq('event_id', eventId)
    .order('position', { ascending: true })
  
  if (error) throw error
  
  return data
}