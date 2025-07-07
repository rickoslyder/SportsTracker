import { createClient } from '@supabase/supabase-js'
import { logger } from '../utils/logger'
import { redis } from '../lib/redis'
import { z } from 'zod'
import { SyncErrorHandler } from './error-handler'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface EventData {
  title: string
  sport_id: number
  start_time: string
  end_time?: string | null
  location?: string | null
  venue?: string | null
  status: 'scheduled' | 'live' | 'completed' | 'cancelled'
  external_id: string
  metadata?: Record<string, any>
  home_team_id?: number | null
  away_team_id?: number | null
  league?: string
  timezone?: string
}

export interface TeamData {
  name: string
  sport_id: number
  logo_url?: string | null
  country?: string | null
  external_id: string
}

export abstract class BaseSyncService {
  protected sportId: number
  protected sportName: string
  protected apiBaseUrl: string
  protected cacheKeyPrefix: string

  constructor(sportId: number, sportName: string, apiBaseUrl: string) {
    this.sportId = sportId
    this.sportName = sportName
    this.apiBaseUrl = apiBaseUrl
    this.cacheKeyPrefix = `api:${sportId}`
  }

  abstract fetchEvents(): Promise<EventData[]>
  abstract fetchTeams(): Promise<TeamData[]>

  protected async getCachedData<T>(key: string): Promise<T | null> {
    if (!redis) {
      return null
    }
    
    try {
      const cached = await redis.get(key)
      if (cached) {
        return JSON.parse(cached) as T
      }
    } catch (error) {
      logger.error(`Error getting cached data for ${key}:`, error)
    }
    return null
  }

  protected async setCachedData<T>(key: string, data: T, ttl = 3600): Promise<void> {
    if (!redis) {
      return
    }
    
    try {
      await redis.set(key, JSON.stringify(data), 'EX', ttl)
    } catch (error) {
      logger.error(`Error setting cached data for ${key}:`, error)
    }
  }

  protected async fetchWithCache<T>(
    cacheKey: string,
    fetchFn: () => Promise<T>,
    ttl = 3600
  ): Promise<T> {
    // Check cache first
    const cached = await this.getCachedData<T>(cacheKey)
    if (cached) {
      logger.debug(`Cache hit for ${cacheKey}`)
      return cached
    }

    // Fetch fresh data
    logger.debug(`Cache miss for ${cacheKey}, fetching fresh data`)
    const data = await fetchFn()
    
    // Cache the result
    await this.setCachedData(cacheKey, data, ttl)
    
    return data
  }

  async syncTeams(): Promise<void> {
    try {
      const teams = await SyncErrorHandler.retryWithBackoff(
        () => this.fetchTeams(),
        {
          sportId: this.sportId,
          sportName: this.sportName,
          endpoint: `${this.apiBaseUrl}/teams`
        }
      )
      logger.info(`Fetched ${teams.length} teams for ${this.sportName}`)

      for (const teamData of teams) {
        const { data: existingTeam } = await supabase
          .from('teams')
          .select('id')
          .eq('external_id', teamData.external_id)
          .eq('sport_id', this.sportId)
          .single()

        if (existingTeam) {
          // Update existing team
          const { error } = await supabase
            .from('teams')
            .update({
              name: teamData.name,
              logo_url: teamData.logo_url,
              country: teamData.country,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingTeam.id)

          if (error) {
            logger.error(`Error updating team ${teamData.name}:`, error)
          }
        } else {
          // Insert new team
          const { error } = await supabase
            .from('teams')
            .insert({
              ...teamData,
              sport_id: this.sportId
            })

          if (error) {
            logger.error(`Error inserting team ${teamData.name}:`, error)
          }
        }
      }
    } catch (error) {
      logger.error(`Error syncing teams for ${this.sportName}:`, error)
      throw error
    }
  }

  async syncEvents(): Promise<void> {
    try {
      const events = await SyncErrorHandler.retryWithBackoff(
        () => this.fetchEvents(),
        {
          sportId: this.sportId,
          sportName: this.sportName,
          endpoint: `${this.apiBaseUrl}/events`
        }
      )
      logger.info(`Fetched ${events.length} events for ${this.sportName}`)

      // Get team mappings
      const { data: teams } = await supabase
        .from('teams')
        .select('id, external_id')
        .eq('sport_id', this.sportId)

      const teamMap = new Map(teams?.map(t => [t.external_id, t.id]) || [])

      for (const eventData of events) {
        // Map external team IDs to internal IDs
        const mappedEvent = {
          ...eventData,
          home_team_id: eventData.home_team_id ? teamMap.get(String(eventData.home_team_id)) : null,
          away_team_id: eventData.away_team_id ? teamMap.get(String(eventData.away_team_id)) : null
        }

        const { data: existingEvent } = await supabase
          .from('events')
          .select('id')
          .eq('external_id', mappedEvent.external_id)
          .eq('sport_id', this.sportId)
          .single()

        if (existingEvent) {
          // Update existing event
          const { error } = await supabase
            .from('events')
            .update({
              title: mappedEvent.title,
              start_time: mappedEvent.start_time,
              end_time: mappedEvent.end_time,
              location: mappedEvent.location,
              venue: mappedEvent.venue,
              status: mappedEvent.status,
              metadata: mappedEvent.metadata,
              home_team_id: mappedEvent.home_team_id,
              away_team_id: mappedEvent.away_team_id,
              timezone: mappedEvent.timezone || 'UTC',
              league: mappedEvent.league,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingEvent.id)

          if (error) {
            logger.error(`Error updating event ${mappedEvent.title}:`, error)
          }
        } else {
          // Insert new event
          const { error } = await supabase
            .from('events')
            .insert({
              ...mappedEvent,
              sport_id: this.sportId,
              timezone: mappedEvent.timezone || 'UTC'
            })

          if (error) {
            logger.error(`Error inserting event ${mappedEvent.title}:`, error)
          }
        }
      }

      // Store API response in cache table for debugging
      await this.storeApiCache(events)
      
    } catch (error) {
      logger.error(`Error syncing events for ${this.sportName}:`, error)
      throw error
    }
  }

  private async storeApiCache(data: any): Promise<void> {
    try {
      await supabase
        .from('api_cache')
        .insert({
          sport_id: this.sportId,
          endpoint: this.apiBaseUrl,
          response_data: data,
          cached_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        })
    } catch (error) {
      logger.error(`Error storing API cache for ${this.sportName}:`, error)
    }
  }

  async sync(): Promise<void> {
    logger.info(`Starting sync for ${this.sportName}`)
    
    try {
      // Sync teams first as events may reference them
      await this.syncTeams()
      
      // Then sync events
      await this.syncEvents()
      
      logger.info(`Completed sync for ${this.sportName}`)
    } catch (error) {
      logger.error(`Failed to sync ${this.sportName}:`, error)
      throw error
    }
  }
}