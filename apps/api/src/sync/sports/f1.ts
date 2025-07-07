import { BaseSyncService, EventData, TeamData } from '../base-sync'
import { logger } from '../../utils/logger'
import axios from 'axios'
import { format, parseISO } from 'date-fns'

interface F1Race {
  raceName: string
  date: string
  time?: string
  Circuit: {
    circuitName: string
    Location: {
      locality: string
      country: string
    }
  }
  FirstPractice?: { date: string; time: string }
  SecondPractice?: { date: string; time: string }
  ThirdPractice?: { date: string; time: string }
  Qualifying?: { date: string; time: string }
  Sprint?: { date: string; time: string }
}

interface F1Constructor {
  constructorId: string
  name: string
  nationality: string
  url?: string
}

class F1SyncService extends BaseSyncService {
  constructor() {
    super(1, 'Formula 1', 'https://ergast.com/api/f1')
  }

  async fetchTeams(): Promise<TeamData[]> {
    try {
      const currentYear = new Date().getFullYear()
      const response = await axios.get(
        `${this.apiBaseUrl}/${currentYear}/constructors.json`,
        { timeout: 10000 }
      )

      const constructors: F1Constructor[] = response.data.MRData.ConstructorTable.Constructors

      return constructors.map(constructor => ({
        name: constructor.name,
        sport_id: this.sportId,
        country: constructor.nationality,
        external_id: constructor.constructorId,
        logo_url: null // F1 API doesn't provide logos
      }))
    } catch (error) {
      logger.error('Error fetching F1 teams:', error)
      return []
    }
  }

  async fetchEvents(): Promise<EventData[]> {
    try {
      const currentYear = new Date().getFullYear()
      const response = await axios.get(
        `${this.apiBaseUrl}/${currentYear}.json`,
        { timeout: 10000 }
      )

      const races: F1Race[] = response.data.MRData.RaceTable.Races
      const events: EventData[] = []

      for (const race of races) {
        // Main race event
        const raceDateTime = this.buildDateTime(race.date, race.time)
        events.push({
          name: race.raceName,
          sport_id: this.sportId,
          start_time: raceDateTime,
          end_time: null,
          location: `${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`,
          venue: race.Circuit.circuitName,
          status: this.getEventStatus(raceDateTime),
          external_id: `${currentYear}-${race.raceName.toLowerCase().replace(/\s+/g, '-')}`,
          metadata: {
            round: races.indexOf(race) + 1,
            season: currentYear
          }
        })

        // Add practice sessions
        if (race.FirstPractice) {
          events.push(this.createSessionEvent(
            race, 
            'FP1', 
            race.FirstPractice.date, 
            race.FirstPractice.time,
            currentYear
          ))
        }

        if (race.SecondPractice) {
          events.push(this.createSessionEvent(
            race, 
            'FP2', 
            race.SecondPractice.date, 
            race.SecondPractice.time,
            currentYear
          ))
        }

        if (race.ThirdPractice) {
          events.push(this.createSessionEvent(
            race, 
            'FP3', 
            race.ThirdPractice.date, 
            race.ThirdPractice.time,
            currentYear
          ))
        }

        // Add qualifying
        if (race.Qualifying) {
          events.push(this.createSessionEvent(
            race, 
            'Qualifying', 
            race.Qualifying.date, 
            race.Qualifying.time,
            currentYear
          ))
        }

        // Add sprint if exists
        if (race.Sprint) {
          events.push(this.createSessionEvent(
            race, 
            'Sprint', 
            race.Sprint.date, 
            race.Sprint.time,
            currentYear
          ))
        }
      }

      return events
    } catch (error) {
      logger.error('Error fetching F1 events:', error)
      return []
    }
  }

  private createSessionEvent(
    race: F1Race, 
    sessionType: string, 
    date: string, 
    time: string,
    year: number
  ): EventData {
    const dateTime = this.buildDateTime(date, time)
    
    return {
      name: `${race.raceName} - ${sessionType}`,
      sport_id: this.sportId,
      start_time: dateTime,
      end_time: null,
      location: `${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`,
      venue: race.Circuit.circuitName,
      status: this.getEventStatus(dateTime),
      external_id: `${year}-${race.raceName.toLowerCase().replace(/\s+/g, '-')}-${sessionType.toLowerCase()}`,
      metadata: {
        sessionType,
        mainEventName: race.raceName,
        season: year
      }
    }
  }

  private buildDateTime(date: string, time?: string): string {
    if (time) {
      return `${date}T${time}`
    }
    // Default to 2 PM if no time specified
    return `${date}T14:00:00Z`
  }

  private getEventStatus(dateTime: string): 'scheduled' | 'live' | 'completed' | 'cancelled' {
    const eventDate = new Date(dateTime)
    const now = new Date()
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)

    if (eventDate > now) {
      return 'scheduled'
    } else if (eventDate <= now && eventDate >= twoHoursAgo) {
      return 'live'
    } else {
      return 'completed'
    }
  }
}

export async function f1Sync(): Promise<void> {
  const service = new F1SyncService()
  await service.sync()
}