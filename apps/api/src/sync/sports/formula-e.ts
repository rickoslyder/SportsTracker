import { BaseSyncService, EventData, TeamData } from '../base-sync'
import { logger } from '../../utils/logger'

class FormulaESyncService extends BaseSyncService {
  constructor() {
    super(2, 'Formula E', 'https://api.formula-e.com')
  }

  async fetchTeams(): Promise<TeamData[]> {
    // Formula E API implementation would go here
    // For now, return empty array as API requires authentication
    logger.info('Formula E sync: Using placeholder data')
    return []
  }

  async fetchEvents(): Promise<EventData[]> {
    // Formula E API implementation would go here
    // For now, return empty array as API requires authentication
    logger.info('Formula E sync: Using placeholder data')
    return []
  }
}

export async function formulaESync(): Promise<void> {
  const service = new FormulaESyncService()
  await service.sync()
}