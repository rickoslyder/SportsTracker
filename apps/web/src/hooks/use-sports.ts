'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '../lib/supabase/client'
import { useEventsCacheStore } from '../stores/events-cache'

export function useSports() {
  const { getCachedSports, setSports } = useEventsCacheStore()
  
  return useQuery({
    queryKey: ['sports'],
    queryFn: async () => {
      // Check cache first
      const cached = getCachedSports()
      if (cached) return cached
      
      const supabase = createClient()
      const { data, error } = await supabase
        .from('sports')
        .select('*')
        .eq('is_active', true)
        .order('name')
      
      if (error) throw error
      
      // Update cache
      if (data) {
        setSports(data)
      }
      
      return data || []
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  })
}