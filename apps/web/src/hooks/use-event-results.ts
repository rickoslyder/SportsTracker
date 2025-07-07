'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '../lib/supabase/client'
import type { Database } from '@sports-tracker/types'

type EventResult = Database['public']['Tables']['event_results']['Row'] & {
  team: Database['public']['Tables']['teams']['Row'] | null
}

export function useEventResults(eventId: string) {
  return useQuery({
    queryKey: ['event-results', eventId],
    queryFn: async () => {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('event_results')
        .select(`
          *,
          team:teams(*)
        `)
        .eq('event_id', eventId)
        .order('position', { ascending: true })
      
      if (error) throw error
      
      return (data as EventResult[]) || []
    },
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  })
}