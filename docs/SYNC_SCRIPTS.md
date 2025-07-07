# Sports Event Tracker - Sync Scripts Documentation

## Overview

The Sports Event Tracker uses an automated sync system to fetch and update sports event data from various external APIs. This system ensures that users always have access to the latest event information, results, and schedules.

## Architecture

### Core Components

1. **Base Sync Service** (`apps/api/src/sync/base-sync.ts`)
   - Abstract base class for all sport-specific sync services
   - Handles common operations: caching, database updates, error handling
   - Implements retry logic with exponential backoff

2. **Sync Orchestrator** (`apps/api/src/sync/index.ts`)
   - Manages cron jobs for all sports
   - Coordinates sync schedules
   - Handles locking to prevent concurrent syncs

3. **Sport-Specific Sync Services** (`apps/api/src/sync/sports/`)
   - Individual implementations for each sport
   - Handle API-specific data transformations

## Sync Schedules

| Sport      | Schedule        | Frequency    | API Source           |
|------------|-----------------|--------------|----------------------|
| Formula 1  | `0 */6 * * *`  | Every 6 hrs  | Ergast F1 API       |
| Formula E  | `0 */6 * * *`  | Every 6 hrs  | Formula E API       |
| MotoGP     | `0 */8 * * *`  | Every 8 hrs  | MotoGP API          |
| UFC        | `0 */4 * * *`  | Every 4 hrs  | UFC API             |
| WWE        | `0 */12 * * *` | Every 12 hrs | WWE API             |
| Boxing     | `0 */6 * * *`  | Every 6 hrs  | Boxing API          |
| IndyCar    | `0 */6 * * *`  | Every 6 hrs  | IndyCar API         |

## How It Works

### 1. Automatic Syncing

When the API server starts, it:
1. Initializes cron jobs for each enabled sport
2. Runs an initial sync for all sports
3. Continues syncing based on the defined schedules

```typescript
// Sync process flow
startSyncJobs()
  ├── Initialize cron jobs
  ├── Run initial sync
  └── Schedule recurring syncs
```

### 2. Sync Process

Each sync follows these steps:

1. **Lock Acquisition**: Prevents duplicate syncs using Redis
2. **Team Sync**: Fetches and updates team/participant data
3. **Event Sync**: Fetches and updates event data
4. **Cache Storage**: Stores raw API responses for debugging
5. **Lock Release**: Frees the sync lock

### 3. Data Flow

```
External API → Sync Service → Data Transformation → Database
                    ↓
                Redis Cache
```

## Manual Sync Triggers

### Admin API Endpoints

- **GET `/api/sync/status`** - Check sync status for all sports
- **POST `/api/sync/trigger/:sportId`** - Manually trigger sync for a sport
- **GET `/api/sync/cache/:sportId`** - View cached API responses
- **GET `/api/sync/logs`** - View sync logs

### Example: Triggering Manual Sync

```bash
# Trigger F1 sync (sportId: 1)
curl -X POST http://localhost:3003/api/sync/trigger/1 \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

## Error Handling

### Retry Strategy

The sync system implements exponential backoff with:
- Initial delay: 1 second
- Max retries: 3
- Backoff multiplier: 2
- Max delay: 10 seconds

### Error Recording

Failed syncs are logged to:
1. Application logs (via winston)
2. `sync_errors` table in database
3. Sentry (if configured)

## Database Schema

### Key Tables

1. **events**
   - Stores all event data
   - Links to sports and teams
   - Includes timezone information

2. **teams**
   - Sport-specific teams/participants
   - Linked via `external_id` from APIs

3. **api_cache**
   - Stores raw API responses
   - Useful for debugging and replay

4. **sync_errors**
   - Tracks sync failures
   - Includes error details and retry counts

## Monitoring & Debugging

### Health Checks

Monitor sync health via:
- Admin dashboard at `/admin/sync`
- API endpoint: `/api/sync/status`
- Database queries on `sync_errors` table

### Common Issues

1. **API Rate Limits**
   - Solution: Adjust sync frequency in config
   - Check `api_cache` for 429 responses

2. **Data Mapping Errors**
   - Check logs for transformation errors
   - Review `api_cache` for unexpected formats

3. **Stale Data**
   - Verify cron jobs are running
   - Check Redis for stuck locks
   - Manual trigger if needed

### Debug Commands

```bash
# Check sync status
curl http://localhost:3003/api/sync/status

# View recent errors
psql -d sports_tracker -c "SELECT * FROM sync_errors ORDER BY created_at DESC LIMIT 10;"

# Check Redis locks
redis-cli KEYS "sync:*:lock"
```

## Adding New Sports

To add a new sport:

1. Create sync service in `apps/api/src/sync/sports/[sport].ts`
2. Extend `BaseSyncService` class
3. Implement `fetchTeams()` and `fetchEvents()` methods
4. Add configuration to `syncConfigs` array
5. Update database with sport entry

Example structure:
```typescript
class NewSportSync extends BaseSyncService {
  constructor() {
    super(sportId, 'Sport Name', 'https://api.example.com')
  }
  
  async fetchTeams(): Promise<TeamData[]> {
    // Implementation
  }
  
  async fetchEvents(): Promise<EventData[]> {
    // Implementation
  }
}
```

## Best Practices

1. **API Usage**
   - Respect rate limits
   - Cache responses appropriately
   - Handle pagination properly

2. **Data Quality**
   - Validate data before storage
   - Handle timezone conversions carefully
   - Maintain data consistency

3. **Performance**
   - Use batch operations for database updates
   - Implement proper indexing
   - Monitor sync duration

4. **Security**
   - Store API keys securely
   - Validate all external data
   - Use service role for database operations

## Troubleshooting

### Sync Not Running

1. Check if Redis is running
2. Verify environment variables are set
3. Check application logs for errors
4. Ensure database connectivity

### Data Not Updating

1. Check sync status endpoint
2. Verify external API is accessible
3. Review transformation logic
4. Check for lock conflicts

### Performance Issues

1. Review sync frequency settings
2. Optimize database queries
3. Check Redis memory usage
4. Monitor API response times