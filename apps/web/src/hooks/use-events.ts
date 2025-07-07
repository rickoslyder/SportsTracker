'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '../lib/supabase/client'
import { useEventsCacheStore } from '../stores/events-cache'
import { useUIStore } from '../stores/ui'
import { Database } from '@sports-tracker/types'

type Event = Database['public']['Tables']['events']['Row']

interface UseEventsOptions {
  sports?: string[]
  status?: string[]
  startDate?: Date
  endDate?: Date
  search?: string
  limit?: number
  offset?: number
}

export function useEvents(options: UseEventsOptions = {}) {
  const eventFilters = useUIStore((state) => state.eventFilters)
  const { getCachedEvents, setEvents } = useEventsCacheStore()
  
  // Merge options with global filters
  const filters = {
    sports: options.sports || eventFilters.sports,
    status: options.status || eventFilters.status,
    startDate: options.startDate || eventFilters.dateRange.start,
    endDate: options.endDate || eventFilters.dateRange.end,
    search: options.search || eventFilters.search,
    limit: options.limit || 50,
    offset: options.offset || 0,
  }
  
  const queryKey = ['events', filters]
  const queryKeyString = JSON.stringify(queryKey)
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      // Check cache first
      const cached = getCachedEvents(queryKeyString)
      if (cached) return cached
      
      const supabase = createClient()
      let query = supabase
        .from('events')
        .select(`
          *,
          sport:sports!inner(*)
        `)
        .order('start_time', { ascending: true })
        .limit(filters.limit)
        .range(filters.offset, filters.offset + filters.limit - 1)
      
      // Apply filters
      if (filters.sports.length > 0) {
        query = query.in('sport.slug', filters.sports)
      }
      
      if (filters.status.length > 0) {
        query = query.in('status', filters.status)
      }
      
      if (filters.startDate) {
        query = query.gte('start_time', filters.startDate.toISOString())
      }
      
      if (filters.endDate) {
        query = query.lte('start_time', filters.endDate.toISOString())
      }
      
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      
      // Update cache
      if (data) {
        setEvents(data as Event[], queryKeyString)
      }
      
      return data || []
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  })
}