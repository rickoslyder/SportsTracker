import { BaseSyncService, EventData, TeamData } from '../base-sync'
import { logger } from '../../utils/logger'

class IndyCarSyncService extends BaseSyncService {
  constructor() {
    super(7, 'IndyCar', 'https://api.indycar.com')
  }

  async fetchTeams(): Promise<TeamData[]> {
    // IndyCar API implementation would go here
    logger.info('IndyCar sync: Using placeholder data')
    return []
  }

  async fetchEvents(): Promise<EventData[]> {
    // IndyCar API implementation would go here
    logger.info('IndyCar sync: Using placeholder data')
    
    const mockEvents: EventData[] = [
      {
        title: 'Indianapolis 500',
        sport_id: this.sportId,
        start_time: new Date('2025-05-25T16:00:00Z').toISOString(),
        end_time: null,
        location: 'Indianapolis, IN',
        venue: 'Indianapolis Motor Speedway',
        status: 'scheduled',
        external_id: 'indy500-2025',
        league: 'IndyCar Series',
        metadata: {
          eventType: 'Race',
          series: 'IndyCar Series'
        }
      }
    ]
    
    return mockEvents
  }
}

export async function indycarSync(): Promise<void> {
  const service = new IndyCarSyncService()
  await service.sync()
}