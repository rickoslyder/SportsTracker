'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '../lib/supabase/client'
import { useEventsCacheStore } from '../stores/events-cache'

export function useTeams(sportId?: number) {
  const { getCachedTeams, setTeams } = useEventsCacheStore()
  
  return useQuery({
    queryKey: ['teams', sportId],
    queryFn: async () => {
      if (!sportId) return []
      
      // Check cache first
      const cached = getCachedTeams(sportId)
      if (cached) return cached
      
      const supabase = createClient()
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('sport_id', sportId)
        .order('name')
      
      if (error) throw error
      
      // Update cache
      if (data) {
        setTeams(data, sportId)
      }
      
      return data || []
    },
    enabled: !!sportId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
  })
}