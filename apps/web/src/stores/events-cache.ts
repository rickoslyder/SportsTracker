import { create } from 'zustand'
import { Database } from '@sports-tracker/types'

type Event = Database['public']['Tables']['events']['Row']
type Sport = Database['public']['Tables']['sports']['Row']
type Team = Database['public']['Tables']['teams']['Row']

interface EventsCacheStore {
  // Cached data
  events: Record<string, Event>
  sports: Sport[]
  teams: Record<number, Team[]> // Grouped by sport_id
  
  // Cache metadata
  lastFetched: {
    events: Record<string, number> // key: query string, value: timestamp
    sports: number | null
    teams: Record<number, number> // sport_id: timestamp
  }
  
  // Actions
  setEvents: (events: Event[], queryKey: string) => void
  setSports: (sports: Sport[]) => void
  setTeams: (teams: Team[], sportId: number) => void
  
  // Cache helpers
  getCachedEvents: (queryKey: string, maxAge?: number) => Event[] | null
  getCachedSports: (maxAge?: number) => Sport[] | null
  getCachedTeams: (sportId: number, maxAge?: number) => Team[] | null
  
  clearCache: () => void
}

const DEFAULT_CACHE_MAX_AGE = 5 * 60 * 1000 // 5 minutes

export const useEventsCacheStore = create<EventsCacheStore>((set, get) => ({
  // Cached data
  events: {},
  sports: [],
  teams: {},
  
  // Cache metadata
  lastFetched: {
    events: {},
    sports: null,
    teams: {},
  },
  
  // Actions
  setEvents: (events, queryKey) =>
    set((state) => {
      const eventsMap = events.reduce((acc, event) => {
        acc[event.id] = event
        return acc
      }, {} as Record<string, Event>)
      
      return {
        events: { ...state.events, ...eventsMap },
        lastFetched: {
          ...state.lastFetched,
          events: {
            ...state.lastFetched.events,
            [queryKey]: Date.now(),
          },
        },
      }
    }),
  
  setSports: (sports) =>
    set({
      sports,
      lastFetched: {
        ...get().lastFetched,
        sports: Date.now(),
      },
    }),
  
  setTeams: (teams, sportId) =>
    set((state) => ({
      teams: {
        ...state.teams,
        [sportId]: teams,
      },
      lastFetched: {
        ...state.lastFetched,
        teams: {
          ...state.lastFetched.teams,
          [sportId]: Date.now(),
        },
      },
    })),
  
  // Cache helpers
  getCachedEvents: (queryKey, maxAge = DEFAULT_CACHE_MAX_AGE) => {
    const state = get()
    const lastFetched = state.lastFetched.events[queryKey]
    
    if (!lastFetched || Date.now() - lastFetched > maxAge) {
      return null
    }
    
    // Return events based on the query key
    // In a real implementation, you'd parse the query key to filter events
    return Object.values(state.events)
  },
  
  getCachedSports: (maxAge = DEFAULT_CACHE_MAX_AGE) => {
    const state = get()
    const lastFetched = state.lastFetched.sports
    
    if (!lastFetched || Date.now() - lastFetched > maxAge) {
      return null
    }
    
    return state.sports
  },
  
  getCachedTeams: (sportId, maxAge = DEFAULT_CACHE_MAX_AGE) => {
    const state = get()
    const lastFetched = state.lastFetched.teams[sportId]
    
    if (!lastFetched || Date.now() - lastFetched > maxAge) {
      return null
    }
    
    return state.teams[sportId] || null
  },
  
  clearCache: () =>
    set({
      events: {},
      sports: [],
      teams: {},
      lastFetched: {
        events: {},
        sports: null,
        teams: {},
      },
    }),
}))