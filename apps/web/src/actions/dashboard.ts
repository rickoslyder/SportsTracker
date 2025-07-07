'use server'

import { auth } from '@clerk/nextjs'
import { createClient } from '../lib/supabase/server'
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, subDays } from 'date-fns'

export async function getDashboardStats() {
  const { userId } = auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = createClient()
  const today = new Date()
  const monthStart = startOfMonth(today)
  const monthEnd = endOfMonth(today)
  const weekStart = startOfWeek(today)
  const weekEnd = endOfWeek(today)

  // Get total reminders
  const { count: totalReminders } = await supabase
    .from('reminders')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  // Get upcoming events (next 7 days)
  const { count: upcomingEvents } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .gte('start_time', today.toISOString())
    .lte('start_time', new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString())

  // Get watched sports count
  const { data: preferences } = await supabase
    .from('user_preferences')
    .select('sport_preferences')
    .eq('user_id', userId)
    .single()

  const watchedSports = preferences?.sport_preferences?.enabled_sports?.length || 0

  // Get this month's events attended (based on reminders)
  const { count: monthlyEvents } = await supabase
    .from('reminders')
    .select('event_id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', monthStart.toISOString())
    .lte('created_at', monthEnd.toISOString())

  return {
    totalReminders: totalReminders || 0,
    upcomingEvents: upcomingEvents || 0,
    watchedSports,
    monthlyEvents: monthlyEvents || 0,
  }
}

export async function getEventChartData() {
  const { userId } = auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = createClient()
  const last30Days = subDays(new Date(), 30)

  // Get events by sport for the last 30 days
  const { data: events } = await supabase
    .from('events')
    .select('sport_id, sports(name)')
    .gte('start_time', last30Days.toISOString())
    .lte('start_time', new Date().toISOString())

  // Group by sport
  const chartData = events?.reduce((acc: any[], event: any) => {
    const sportName = event.sports?.name || 'Unknown'
    const existing = acc.find(item => item.sport === sportName)
    
    if (existing) {
      existing.count += 1
    } else {
      acc.push({ sport: sportName, count: 1 })
    }
    
    return acc
  }, []) || []

  return chartData.sort((a, b) => b.count - a.count)
}

export async function getUpcomingEvents(limit = 5) {
  const { userId } = auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = createClient()
  const now = new Date()

  // Get user's sport preferences
  const { data: preferences } = await supabase
    .from('user_preferences')
    .select('sport_preferences')
    .eq('user_id', userId)
    .single()

  const enabledSports = preferences?.sport_preferences?.enabled_sports || []

  // Get upcoming events for enabled sports
  const { data: events } = await supabase
    .from('events')
    .select(`
      *,
      sports(name, slug),
      reminders(id)
    `)
    .in('sport_id', enabledSports)
    .gte('start_time', now.toISOString())
    .order('start_time', { ascending: true })
    .limit(limit)

  return events || []
}

export async function getRecentActivity(limit = 10) {
  const { userId } = auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = createClient()

  // Get recent reminders with event data
  const { data: reminders } = await supabase
    .from('reminders')
    .select(`
      *,
      events(
        name,
        start_time,
        sports(name)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  return reminders || []
}

export async function getFavoriteSportsStats() {
  const { userId } = auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = createClient()

  // Get user's sport preferences
  const { data: preferences } = await supabase
    .from('user_preferences')
    .select('sport_preferences')
    .eq('user_id', userId)
    .single()

  const enabledSports = preferences?.sport_preferences?.enabled_sports || []

  // Get event counts for each sport
  const { data: sports } = await supabase
    .from('sports')
    .select(`
      id,
      name,
      slug,
      events(count)
    `)
    .in('id', enabledSports)

  return sports?.map(sport => ({
    id: sport.id,
    name: sport.name,
    slug: sport.slug,
    eventCount: sport.events?.[0]?.count || 0
  })) || []
}