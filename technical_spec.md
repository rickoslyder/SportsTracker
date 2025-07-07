<specification_planning>

## 1. Core System Architecture and Key Workflows

### Architecture Overview
- **Backend API Server**: Node.js/Express or Python/FastAPI for data aggregation and API endpoints
- **Web Frontend**: React/Next.js for the primary web application
- **Mobile Apps**: React Native for iOS/Android
- **Desktop App**: Electron wrapping the web app
- **Database**: PostgreSQL for event data, Redis for caching
- **External Services**: Supabase for sync, various sports APIs, push notification services

### Key Workflows
1. **Event Data Pipeline**:
   - Scheduled jobs fetch from APIs/scrape sources
   - Data normalized and stored in database
   - Cache layer for frequent queries
   - Real-time updates during live events

2. **User Configuration Flow**:
   - Local storage for device-specific settings
   - Optional sync via Supabase
   - Shareable config URLs with encryption

3. **Notification System**:
   - Event selection → reminder scheduling
   - Platform-specific notification delivery
   - Fallback mechanisms for failed notifications

### Challenges to Address
- API rate limiting across multiple sports data sources
- Handling different data formats from various APIs
- Cross-platform notification implementation
- Real-time updates without overwhelming the system
- Timezone handling across global events

## 2. Project Structure and Organization

### Monorepo Structure
```
sports-event-tracker/
├── apps/
│   ├── web/                 # Next.js web app
│   ├── mobile/              # React Native app
│   ├── desktop/             # Electron app
│   └── api/                 # Backend API server
├── packages/
│   ├── shared/              # Shared types, utilities
│   ├── ui/                  # Shared UI components
│   ├── data-fetcher/        # Sports data aggregation
│   └── notification-service/ # Notification handling
├── infrastructure/          # Docker, deployment configs
└── docs/                    # Documentation
```

### Key Considerations
- Shared code between platforms via packages
- Platform-specific implementations where needed
- Consistent data models across all apps

## 3. Detailed Feature Specifications

### Core Features to Implement
1. **Event Display System**
   - Chronological grouping with date headers
   - Smart session expansion logic
   - Conflict resolution algorithm
   - Drag-and-drop reordering

2. **No Spoiler Mode**
   - CSS-based hiding with spoiler class
   - Server-side filtering option
   - Granular control per sport/event type

3. **Configuration Management**
   - Local storage with migration support
   - Supabase sync with conflict resolution
   - Config URL generation with encryption
   - Import/export functionality

4. **Notification System**
   - Multi-platform support (Web Push, iOS, Android)
   - Customizable timing options
   - Batch notification management
   - Delivery tracking and retry logic

### Edge Cases
- Network failures during data fetch
- Conflicting user preferences across devices
- Events with changing schedules
- Timezone changes during travel
- API deprecation handling

## 4. Database Schema Design

### Core Tables Needed
1. **events** - All sporting events
2. **sports** - Sport/league definitions
3. **teams** - Teams/participants
4. **user_configs** - User preferences
5. **reminders** - Scheduled notifications
6. **sync_tokens** - For config sharing
7. **api_cache** - Cached API responses
8. **data_sources** - API/scraping configs

### Relationships
- events → sports (many-to-one)
- events → teams (many-to-many)
- reminders → events (many-to-one)
- user_configs → sync_tokens (one-to-many)

### Indexing Strategy
- Composite indexes on (sport_id, event_date)
- Full-text search on event descriptions
- Timezone-aware date indexing

## 5. Server Actions and Integrations

### API Endpoints Needed
1. **Event Management**
   - GET /events (with filtering, pagination)
   - GET /events/live
   - POST /events/refresh

2. **Configuration**
   - GET/POST /config
   - POST /config/sync
   - GET /config/share/:token

3. **Notifications**
   - POST /reminders
   - DELETE /reminders/:id
   - GET /reminders/upcoming

### External Integrations
1. **Sports APIs**
   - F1/F2/F3: Ergast API or official F1 API
   - Formula E: Official API or web scraping
   - MotoGP: Official API or SportRadar
   - UFC: UFC Stats API or web scraping
   - Football: Football-data.org or similar

2. **Infrastructure Services**
   - Supabase for sync
   - SendGrid/Twilio for notifications
   - Cloudflare for caching

## 6. Design System and Component Architecture

### Visual Design
- Clean, sports-focused aesthetic
- High contrast for readability
- Dark mode with OLED optimization
- Consistent iconography (Lucide icons)

### Component Library
1. **Layout Components**
   - AppShell (nav, main, footer)
   - DateGroupHeader
   - SportSection

2. **Event Components**
   - EventCard (collapsible)
   - SessionList
   - ResultDisplay (spoiler-aware)
   - ReminderButton

3. **Configuration Components**
   - SportSelector
   - TeamPicker
   - NotificationSettings
   - SyncManager

## 7. Authentication and Authorization Implementation

### Approaches
1. **Anonymous First**
   - Full functionality without login
   - Optional account for sync

2. **Clerk Integration**
   - Social logins (Google, Apple)
   - Device management
   - Sync conflict resolution

### Security Considerations
- Config URL encryption
- API rate limiting per user
- Secure notification tokens

## 8. Data Flow and State Management

### State Architecture
1. **Client State**
   - Zustand for local preferences
   - React Query for server data
   - Optimistic updates

2. **Server State**
   - Event data caching
   - User preference versioning
   - Sync queue management

### Real-time Updates
- WebSocket for live events
- Server-Sent Events fallback
- Polling for compatibility

## 9. Payment Implementation

### Potential Premium Features
1. **Pro Tier**
   - Unlimited reminders
   - Advanced filtering
   - Multiple device sync
   - API access

2. **Team Tier**
   - Shared configurations
   - Group notifications
   - Custom data sources

### Stripe Integration
- Subscription management
- Usage-based billing for API calls
- Free tier with limits

## 10. Analytics Implementation

### Key Metrics
1. **User Engagement**
   - Active users by sport
   - Reminder conversion rates
   - Feature adoption

2. **Technical Metrics**
   - API response times
   - Cache hit rates
   - Error rates by platform

### Implementation
- PostHog for product analytics
- Sentry for error tracking
- Custom dashboard for operations

## 11. Testing Strategy

### Test Coverage Goals
1. **Unit Tests (80%)**
   - Data transformation logic
   - Date/timezone handling
   - Configuration merging

2. **Integration Tests**
   - API endpoint testing
   - Database operations
   - External API mocking

3. **E2E Tests**
   - Critical user flows
   - Cross-platform scenarios
   - Notification delivery

### Testing Tools
- Jest for unit tests
- Playwright for E2E
- React Native Testing Library
- Mock Service Worker for API mocking

</specification_planning>

# Sports Event Tracker Technical Specification

## 1. System Overview

### Core Purpose and Value Proposition
The Sports Event Tracker is a multi-platform application designed to solve the fragmented nature of following multiple sports. It provides a unified dashboard for sports fans to track events across F1/F2/F3, Formula E, MotoGP, UFC, and football, with a unique "no spoiler" mode that allows users to check schedules without accidentally seeing results.

### Key Workflows
1. **Event Discovery Flow**: User opens app → sees today's events → expands for session details → sets reminders
2. **Configuration Flow**: User selects sports/teams → preferences save locally → optionally syncs across devices
3. **Notification Flow**: User selects event → chooses reminder time → receives platform-specific notification
4. **Sharing Flow**: User configures preferences → generates shareable URL → others import configuration

### System Architecture
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Web App       │     │  Mobile Apps    │     │  Desktop App    │
│   (Next.js)     │     │ (React Native)  │     │   (Electron)    │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                         │
         └───────────────────────┴─────────────────────────┘
                                 │
                        ┌────────▼────────┐
                        │   API Gateway   │
                        │   (Express)     │
                        └────────┬────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
┌───────▼────────┐     ┌────────▼────────┐     ┌────────▼────────┐
│ Event Service  │     │ Config Service  │     │Notification Svc │
│                │     │   (Supabase)    │     │                 │
└───────┬────────┘     └─────────────────┘     └─────────────────┘
        │
┌───────▼────────┐     ┌─────────────────┐
│  PostgreSQL    │     │     Redis       │
│   Database     │     │     Cache       │
└────────────────┘     └─────────────────┘
```

## 2. Project Structure

```
sports-event-tracker/
├── apps/
│   ├── web/
│   │   ├── app/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── page.tsx              # Main dashboard
│   │   │   │   ├── events/
│   │   │   │   │   └── [id]/page.tsx     # Event detail
│   │   │   │   └── settings/
│   │   │   │       └── page.tsx          # User settings
│   │   │   ├── api/
│   │   │   │   ├── events/route.ts       # Event endpoints
│   │   │   │   ├── config/route.ts       # Config endpoints
│   │   │   │   └── reminders/route.ts    # Reminder endpoints
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── events/
│   │   │   │   ├── EventCard.tsx
│   │   │   │   ├── EventList.tsx
│   │   │   │   └── SessionExpander.tsx
│   │   │   ├── config/
│   │   │   │   ├── SportSelector.tsx
│   │   │   │   └── TeamPicker.tsx
│   │   │   └── ui/                       # Shared UI components
│   │   └── lib/
│   │       ├── api.ts                    # API client
│   │       ├── storage.ts                # Local storage utils
│   │       └── utils.ts
│   │
│   ├── mobile/
│   │   ├── src/
│   │   │   ├── screens/
│   │   │   ├── components/
│   │   │   └── services/
│   │   ├── ios/
│   │   └── android/
│   │
│   ├── desktop/
│   │   ├── src/
│   │   │   ├── main.js                   # Electron main process
│   │   │   └── preload.js
│   │   └── build/
│   │
│   └── api/
│       ├── src/
│       │   ├── routes/
│       │   ├── services/
│       │   ├── models/
│       │   └── utils/
│       └── tests/
│
├── packages/
│   ├── shared/
│   │   ├── types/
│   │   │   ├── event.ts
│   │   │   ├── config.ts
│   │   │   └── notification.ts
│   │   └── utils/
│   │       ├── date.ts
│   │       └── timezone.ts
│   │
│   ├── ui/
│   │   ├── components/
│   │   └── styles/
│   │
│   ├── data-fetcher/
│   │   ├── sources/
│   │   │   ├── f1/
│   │   │   ├── ufc/
│   │   │   └── football/
│   │   └── scheduler.ts
│   │
│   └── notification-service/
│       ├── providers/
│       │   ├── web-push.ts
│       │   ├── ios.ts
│       │   └── android.ts
│       └── queue.ts
│
├── infrastructure/
│   ├── docker/
│   ├── k8s/
│   └── terraform/
│
└── docs/
    ├── api/
    └── setup/
```

## 3. Feature Specification

### 3.1 Event Display System

**User Story**: As a user, I want to see all my configured sports events in chronological order, grouped by day, so I can quickly plan my viewing schedule.

**Implementation Steps**:
1. Fetch events from database with user's sport/team filters
2. Group events by date using `date-fns` for timezone handling
3. Apply sorting algorithm:
   ```typescript
   const sortEvents = (events: Event[]) => {
     return events.sort((a, b) => {
       // Primary: User preference weight
       const weightDiff = (a.userWeight ?? 0) - (b.userWeight ?? 0);
       if (weightDiff !== 0) return weightDiff;
       
       // Secondary: Start time
       const timeDiff = a.startTime.getTime() - b.startTime.getTime();
       if (timeDiff !== 0) return timeDiff;
       
       // Tertiary: Proximity to next event in same sport
       const proximityDiff = getProximityScore(a) - getProximityScore(b);
       return proximityDiff;
     });
   };
   ```
4. Render with date group headers
5. Implement smart expansion:
   - Auto-expand if event starts within 4 hours
   - Remember manual expansion state in session storage

**Error Handling**:
- Network failure: Show cached data with "offline" indicator
- Empty results: Display sport-specific suggestions
- Invalid date data: Fallback to UTC display with warning

### 3.2 No Spoiler Mode

**User Story**: As a user, I want to hide results and scores by default so I can check schedules without spoiling events I plan to watch later.

**Implementation Steps**:
1. Add global `hideSpoilers` state (default: true)
2. Apply CSS class-based hiding:
   ```css
   .spoiler {
     background-color: #9ca3af;
     color: #9ca3af;
     border-radius: 0.25rem;
     padding: 0 0.25rem;
     user-select: none;
     transition: all 0.3s ease;
   }
   
   .show-spoilers .spoiler {
     background-color: transparent;
     color: inherit;
   }
   ```
3. Server-side filtering option for API responses
4. Persist preference in local storage
5. Add visual indicator when spoiler mode is active

**Edge Cases**:
- Partial results (e.g., ongoing matches)
- Results in event titles
- Social media embeds containing spoilers

### 3.3 Multi-Session Event Support

**User Story**: As a motorsport fan, I want to see all practice, qualifying, and race sessions for a race weekend so I can plan which sessions to watch.

**Implementation Steps**:
1. Model parent-child event relationships
2. Create collapsible session groups:
   ```typescript
   interface SessionGroup {
     parentEvent: Event;
     sessions: Session[];
     isExpanded: boolean;
   }
   ```
3. Implement intelligent grouping:
   - Group by venue and date range
   - Show session types with icons
   - Display duration for each session
4. Add "expand all/collapse all" controls

**Error Handling**:
- Missing session data: Show "Schedule TBA"
- Conflicting sessions: Highlight conflicts visually

### 3.4 Reminder System

**User Story**: As a user, I want to set customizable reminders for events so I don't miss them.

**Implementation Steps**:
1. Create reminder selection UI with preset options
2. Store reminders with event association:
   ```typescript
   interface Reminder {
     id: string;
     eventId: string;
     userId?: string;
     reminderTime: Date;
     notificationType: 'push' | 'email' | 'sms';
     status: 'pending' | 'sent' | 'failed';
   }
   ```
3. Implement platform-specific delivery:
   - Web: Service Worker + Push API
   - iOS/Android: Native notification APIs
   - Desktop: Electron notification API
4. Add reminder queue with retry logic
5. Track delivery status

**Edge Cases**:
- Event time changes after reminder set
- User timezone changes
- Notification permissions denied

### 3.5 Configuration Sharing

**User Story**: As a user, I want to share my sports configuration with friends so they can follow the same events.

**Implementation Steps**:
1. Serialize configuration to JSON
2. Encrypt with AES-256:
   ```typescript
   const encryptConfig = (config: UserConfig, password?: string) => {
     const key = password || generateRandomKey();
     const encrypted = CryptoJS.AES.encrypt(
       JSON.stringify(config),
       key
     ).toString();
     return { encrypted, key };
   };
   ```
3. Generate shareable URL:
   - Read-only: `/import?config={encrypted}`
   - Collaborative: `/collab?token={token}&key={key}`
4. Implement import flow with preview
5. Add version compatibility checking

**Error Handling**:
- Invalid config data: Show specific error
- Version mismatch: Attempt migration
- Malformed URLs: Graceful fallback

## 4. Database Schema

### 4.1 Tables

#### events
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sport_id INTEGER NOT NULL REFERENCES sports(id),
  league VARCHAR(100) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  timezone VARCHAR(50) NOT NULL,
  venue VARCHAR(200),
  status VARCHAR(50) NOT NULL CHECK (status IN ('scheduled', 'live', 'finished', 'cancelled', 'postponed')),
  parent_event_id UUID REFERENCES events(id),
  session_type VARCHAR(50),
  external_id VARCHAR(200),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_sport_start ON events(sport_id, start_time);
CREATE INDEX idx_events_status ON events(status) WHERE status IN ('scheduled', 'live');
CREATE INDEX idx_events_parent ON events(parent_event_id) WHERE parent_event_id IS NOT NULL;
```

#### sports
```sql
CREATE TABLE sports (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(7) NOT NULL,
  icon VARCHAR(50),
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO sports (name, slug, color, icon) VALUES
  ('Formula 1', 'f1', '#E10600', 'flag-checkered'),
  ('Formula 2', 'f2', '#0090FF', 'flag-checkered'),
  ('Formula 3', 'f3', '#666666', 'flag-checkered'),
  ('Formula E', 'formula-e', '#00B4E6', 'zap'),
  ('MotoGP', 'motogp', '#CC0000', 'bike'),
  ('UFC', 'ufc', '#D20A0A', 'sword'),
  ('Football', 'football', '#38A169', 'football');
```

#### teams
```sql
CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  sport_id INTEGER NOT NULL REFERENCES sports(id),
  name VARCHAR(200) NOT NULL,
  short_name VARCHAR(50),
  logo_url VARCHAR(500),
  external_id VARCHAR(200),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sport_id, name)
);

CREATE TABLE event_teams (
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  is_home BOOLEAN DEFAULT false,
  PRIMARY KEY (event_id, team_id)
);
```

#### user_configs
```sql
CREATE TABLE user_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(200), -- Clerk user ID, nullable for anonymous
  device_id VARCHAR(200) NOT NULL,
  config_data JSONB NOT NULL,
  version INTEGER DEFAULT 1,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, device_id)
);

CREATE INDEX idx_user_configs_device ON user_configs(device_id);
```

#### reminders
```sql
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id VARCHAR(200),
  device_id VARCHAR(200),
  reminder_time TIMESTAMPTZ NOT NULL,
  notification_type VARCHAR(50) NOT NULL DEFAULT 'push',
  status VARCHAR(50) DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reminders_time ON reminders(reminder_time) WHERE status = 'pending';
CREATE INDEX idx_reminders_event ON reminders(event_id);
```

#### sync_tokens
```sql
CREATE TABLE sync_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token VARCHAR(200) NOT NULL UNIQUE,
  config_data JSONB NOT NULL,
  password_hash VARCHAR(200),
  is_collaborative BOOLEAN DEFAULT false,
  access_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sync_tokens_token ON sync_tokens(token);
```

#### api_cache
```sql
CREATE TABLE api_cache (
  id SERIAL PRIMARY KEY,
  cache_key VARCHAR(500) NOT NULL UNIQUE,
  data JSONB NOT NULL,
  source VARCHAR(100) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_api_cache_key ON api_cache(cache_key);
CREATE INDEX idx_api_cache_expires ON api_cache(expires_at);
```

## 5. Server Actions

### 5.1 Database Actions

#### getEvents
```typescript
interface GetEventsParams {
  sports?: string[];
  teams?: number[];
  startDate?: Date;
  endDate?: Date;
  includeFinished?: boolean;
  limit?: number;
  offset?: number;
}

async function getEvents(params: GetEventsParams): Promise<Event[]> {
  const query = db
    .select({
      event: events,
      sport: sports,
      teams: sql`
        ARRAY_AGG(
          JSON_BUILD_OBJECT(
            'id', ${teams.id},
            'name', ${teams.name},
            'isHome', ${eventTeams.isHome}
          )
        ) FILTER (WHERE ${teams.id} IS NOT NULL)
      `.as('teams')
    })
    .from(events)
    .leftJoin(sports, eq(events.sportId, sports.id))
    .leftJoin(eventTeams, eq(events.id, eventTeams.eventId))
    .leftJoin(teams, eq(eventTeams.teamId, teams.id))
    .groupBy(events.id, sports.id);

  // Apply filters
  if (params.sports?.length) {
    query.where(inArray(sports.slug, params.sports));
  }
  
  if (params.startDate) {
    query.where(gte(events.startTime, params.startDate));
  }
  
  if (!params.includeFinished) {
    query.where(ne(events.status, 'finished'));
  }
  
  return query.limit(params.limit ?? 100).offset(params.offset ?? 0);
}
```

#### saveUserConfig
```typescript
async function saveUserConfig(
  deviceId: string,
  config: UserConfig,
  userId?: string
): Promise<void> {
  await db
    .insert(userConfigs)
    .values({
      deviceId,
      userId,
      configData: config,
      version: config.version || 1,
      updatedAt: new Date()
    })
    .onConflictDoUpdate({
      target: [userConfigs.userId, userConfigs.deviceId],
      set: {
        configData: config,
        version: sql`${userConfigs.version} + 1`,
        updatedAt: new Date()
      }
    });
}
```

#### createReminder
```typescript
async function createReminder(
  eventId: string,
  reminderTime: Date,
  deviceId: string,
  userId?: string
): Promise<string> {
  const [reminder] = await db
    .insert(reminders)
    .values({
      eventId,
      reminderTime,
      deviceId,
      userId,
      notificationType: 'push',
      status: 'pending'
    })
    .returning();
    
  // Queue for processing
  await reminderQueue.add('process-reminder', {
    reminderId: reminder.id,
    scheduledFor: reminderTime
  });
  
  return reminder.id;
}
```

### 5.2 Other Actions

#### Sports Data Fetching

**F1/F2/F3 Integration**
```typescript
class ErgastAPIClient {
  private baseURL = 'https://ergast.com/api/f1';
  
  async getRaceSchedule(year: number, series: 'f1' | 'f2' | 'f3') {
    const endpoint = series === 'f1' 
      ? `${year}.json`
      : `${year}/${series}.json`;
      
    const response = await fetch(`${this.baseURL}/${endpoint}`);
    const data = await response.json();
    
    return this.transformRaces(data.MRData.RaceTable.Races);
  }
  
  private transformRaces(races: any[]): Event[] {
    return races.flatMap(race => {
      const baseEvent = {
        sport: 'f1',
        league: race.series,
        venue: race.Circuit.circuitName,
        timezone: this.getTimezone(race.Circuit.Location)
      };
      
      const events: Event[] = [];
      
      // Create events for each session
      if (race.FirstPractice) {
        events.push({
          ...baseEvent,
          title: `${race.raceName} - FP1`,
          startTime: new Date(`${race.FirstPractice.date}T${race.FirstPractice.time}`)
        });
      }
      
      // ... similar for other sessions
      
      return events;
    });
  }
}
```

**UFC Data Scraping**
```typescript
class UFCScraper {
  async getUpcomingEvents(): Promise<Event[]> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto('https://www.ufc.com/events');
    
    const events = await page.evaluate(() => {
      const eventCards = document.querySelectorAll('.c-card-event--result');
      
      return Array.from(eventCards).map(card => {
        const title = card.querySelector('.c-card-event--result__headline')?.textContent;
        const date = card.querySelector('.c-card-event--result__date')?.getAttribute('data-main-card-timestamp');
        const venue = card.querySelector('.field--name-venue')?.textContent;
        
        return {
          title,
          date: new Date(parseInt(date) * 1000),
          venue,
          status: 'scheduled'
        };
      });
    });
    
    await browser.close();
    return this.transformEvents(events);
  }
}
```

#### Config Sharing

```typescript
async function generateShareableConfig(
  config: UserConfig,
  options: { collaborative?: boolean; password?: string }
): Promise<string> {
  const token = generateSecureToken();
  const encrypted = encryptConfig(config, options.password);
  
  await db.insert(syncTokens).values({
    token,
    configData: encrypted,
    passwordHash: options.password ? await bcrypt.hash(options.password, 10) : null,
    isCollaborative: options.collaborative || false,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  });
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  return `${baseUrl}/import?token=${token}`;
}
```

#### Real-time Updates

```typescript
class LiveEventUpdater {
  private io: Server;
  
  async startLiveTracking(eventId: string) {
    const event = await getEventById(eventId);
    
    // Set up polling based on sport type
    const pollInterval = this.getPollInterval(event.sport);
    
    const intervalId = setInterval(async () => {
      const updates = await this.fetchLiveData(event);
      
      if (updates) {
        // Update database
        await updateEvent(eventId, updates);
        
        // Broadcast to connected clients
        this.io.to(`event:${eventId}`).emit('event-update', updates);
        
        // Check if event finished
        if (updates.status === 'finished') {
          clearInterval(intervalId);
          await this.cleanupLiveTracking(eventId);
        }
      }
    }, pollInterval);
    
    // Store interval ID for cleanup
    this.activeTrackers.set(eventId, intervalId);
  }
}
```

## 6. Design System

### 6.1 Visual Style

#### Color Palette
```css
:root {
  /* Primary Colors */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  
  /* Sport-Specific Colors */
  --f1-red: #e10600;
  --f2-blue: #0090ff;
  --f3-gray: #666666;
  --fe-cyan: #00b4e6;
  --motogp-red: #cc0000;
  --ufc-red: #d20a0a;
  --football-green: #38a169;
  
  /* Neutral Colors */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
  
  /* Semantic Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
  
  /* Dark Mode */
  --dark-bg: #0f172a;
  --dark-surface: #1e293b;
  --dark-border: #334155;
}
```

#### Typography
```css
:root {
  /* Font Families */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;
  
  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  
  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  
  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}
```

#### Component Styling Patterns
```typescript
// Base component styles using CSS modules
const styles = {
  card: `
    bg-white dark:bg-gray-800
    border border-gray-200 dark:border-gray-700
    rounded-lg shadow-sm
    hover:shadow-md
    transition-shadow duration-200
  `,
  
  button: {
    base: `
      inline-flex items-center justify-center
      px-4 py-2 rounded-md
      font-medium text-sm
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2
    `,
    primary: `
      bg-primary-600 text-white
      hover:bg-primary-700
      focus:ring-primary-500
    `,
    secondary: `
      bg-gray-100 text-gray-700
      hover:bg-gray-200
      focus:ring-gray-500
    `
  }
};
```

### 6.2 Core Components

#### Layout Structure
```tsx
// AppShell.tsx
interface AppShellProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export function AppShell({ children, showSidebar = true }: AppShellProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex">
        {showSidebar && <Sidebar />}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
```

#### Navigation Patterns
```tsx
// Navigation.tsx
const navigationItems = [
  { href: '/', label: 'Events', icon: Calendar },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/reminders', label: 'Reminders', icon: Bell },
  { href: '/shared', label: 'Shared', icon: Share2 }
];

export function Navigation() {
  const pathname = usePathname();
  
  return (
    <nav className="space-y-1">
      {navigationItems.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-md',
            'text-sm font-medium transition-colors',
            pathname === item.href
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-600 hover:bg-gray-100'
          )}
        >
          <item.icon className="w-5 h-5" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
```

#### Shared Components

**EventCard Component**
```tsx
interface EventCardProps {
  event: Event;
  isExpanded?: boolean;
  onToggle?: () => void;
  onSetReminder?: (time: ReminderTime) => void;
  showSpoilers?: boolean;
}

export function EventCard({ 
  event, 
  isExpanded = false,
  onToggle,
  onSetReminder,
  showSpoilers = false 
}: EventCardProps) {
  const isLive = event.status === 'live';
  const isPast = event.status === 'finished';
  
  return (
    <div className={cn(
      'event-card',
      isLive && 'ring-2 ring-red-500',
      isPast && 'opacity-75'
    )}>
      <div className="flex items-start justify-between p-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <SportBadge sport={event.sport} />
            <h3 className="font-semibold text-gray-900">
              {event.title}
            </h3>
            {isLive && <LiveIndicator />}
          </div>
          
          <p className="text-sm text-gray-600">
            {formatEventTime(event.startTime)}
          </p>
          
          {event.venue && (
            <p className="text-sm text-gray-500 mt-1">
              <MapPin className="inline w-3 h-3 mr-1" />
              {event.venue}
            </p>
          )}
          
          {isPast && event.result && (
            <div className="mt-2">
              <ResultDisplay 
                result={event.result} 
                showSpoiler={showSpoilers} 
              />
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {!isPast && (
            <ReminderButton
              eventId={event.id}
              onSetReminder={onSetReminder}
            />
          )}
          
          {event.sessions && (
            <button
              onClick={onToggle}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <ChevronDown 
                className={cn(
                  'w-4 h-4 transition-transform',
                  isExpanded && 'rotate-180'
                )}
              />
            </button>
          )}
        </div>
      </div>
      
      {isExpanded && event.sessions && (
        <SessionList sessions={event.sessions} />
      )}
    </div>
  );
}
```

**SportSelector Component**
```tsx
interface SportSelectorProps {
  selectedSports: string[];
  onChange: (sports: string[]) => void;
  availableSports: Sport[];
}

export function SportSelector({ 
  selectedSports, 
  onChange, 
  availableSports 
}: SportSelectorProps) {
  const toggleSport = (sportId: string) => {
    if (selectedSports.includes(sportId)) {
      onChange(selectedSports.filter(s => s !== sportId));
    } else {
      onChange([...selectedSports, sportId]);
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-700">Sports</h3>
        <div className="space-x-2">
          <button
            onClick={() => onChange(availableSports.map(s => s.id))}
            className="text-xs text-primary-600 hover:underline"
          >
            Select All
          </button>
          <button
            onClick={() => onChange([])}
            className="text-xs text-gray-600 hover:underline"
          >
            Clear
          </button>
        </div>
      </div>
      
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {availableSports.map(sport => (
          <label
            key={sport.id}
            className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedSports.includes(sport.id)}
              onChange={() => toggleSport(sport.id)}
              className="mr-3 h-4 w-4 text-primary-600 rounded"
            />
            <SportBadge sport={sport} />
            <span className="ml-2 text-sm">{sport.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
```

## 7. Component Architecture

### 7.1 Server Components

#### EventListServer.tsx
```tsx
interface EventListServerProps {
  searchParams: {
    sports?: string;
    teams?: string;
    date?: string;
  };
}

export async function EventListServer({ searchParams }: EventListServerProps) {
  const sports = searchParams.sports?.split(',') || [];
  const teams = searchParams.teams?.split(',').map(Number) || [];
  const date = searchParams.date ? new Date(searchParams.date) : new Date();
  
  const events = await getEvents({
    sports,
    teams,
    startDate: startOfDay(date),
    endDate: addDays(date, 7),
    includeFinished: true
  });
  
  // Group events by date
  const groupedEvents = groupEventsByDate(events);
  
  return (
    <div className="space-y-6">
      {Object.entries(groupedEvents).map(([dateKey, dayEvents]) => (
        <div key={dateKey}>
          <DateHeader date={dateKey} />
          <Suspense fallback={<EventListSkeleton count={3} />}>
            <div className="space-y-3">
              {dayEvents.map(event => (
                <EventCardClient
                  key={event.id}
                  event={event}
                  defaultExpanded={isWithinHours(event.startTime, 4)}
                />
              ))}
            </div>
          </Suspense>
        </div>
      ))}
    </div>
  );
}
```

#### SettingsServer.tsx
```tsx
export async function SettingsServer() {
  const sports = await getSports();
  const teams = await getTeams();
  
  return (
    <ErrorBoundary fallback={<SettingsError />}>
      <div className="space-y-6">
        <ConfigSection title="Sports & Leagues">
          <SportSelectorClient availableSports={sports} />
        </ConfigSection>
        
        <ConfigSection title="Teams">
          <TeamPickerClient availableTeams={teams} />
        </ConfigSection>
        
        <ConfigSection title="Notifications">
          <NotificationSettingsClient />
        </ConfigSection>
        
        <ConfigSection title="Data & Sync">
          <SyncSettingsClient />
        </ConfigSection>
      </div>
    </ErrorBoundary>
  );
}
```

### 7.2 Client Components

#### EventCardClient.tsx
```tsx
'use client';

interface EventCardClientProps {
  event: Event;
  defaultExpanded?: boolean;
}

export function EventCardClient({ event, defaultExpanded = false }: EventCardClientProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showSpoilers, setShowSpoilers] = useLocalStorage('showSpoilers', false);
  const { setReminder, hasReminder } = useReminders();
  
  const handleSetReminder = async (time: ReminderTime) => {
    try {
      await setReminder(event.id, time);
      toast.success('Reminder set successfully');
    } catch (error) {
      toast.error('Failed to set reminder');
    }
  };
  
  return (
    <EventCard
      event={event}
      isExpanded={isExpanded}
      onToggle={() => setIsExpanded(!isExpanded)}
      onSetReminder={handleSetReminder}
      showSpoilers={showSpoilers}
    />
  );
}
```

#### ConfigManager.tsx
```tsx
'use client';

interface ConfigManagerProps {
  initialConfig?: UserConfig;
}

export function ConfigManager({ initialConfig }: ConfigManagerProps) {
  const [config, setConfig] = useState<UserConfig>(
    initialConfig || getDefaultConfig()
  );
  const [isSaving, setIsSaving] = useState(false);
  const debouncedConfig = useDebounce(config, 500);
  
  // Auto-save to local storage
  useEffect(() => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(debouncedConfig));
  }, [debouncedConfig]);
  
  // Sync to server if authenticated
  const { user } = useAuth();
  useEffect(() => {
    if (user && debouncedConfig) {
      syncConfig(debouncedConfig);
    }
  }, [user, debouncedConfig]);
  
  const updateConfig = (updates: Partial<UserConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...updates,
      version: prev.version + 1,
      updatedAt: new Date()
    }));
  };
  
  const generateShareUrl = async () => {
    setIsSaving(true);
    try {
      const url = await createShareableConfig(config);
      await navigator.clipboard.writeText(url);
      toast.success('Share URL copied to clipboard');
    } catch (error) {
      toast.error('Failed to generate share URL');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <ConfigContext.Provider value={{ config, updateConfig }}>
      <div className="space-y-4">
        {/* Config UI components */}
        <div className="flex justify-end">
          <button
            onClick={generateShareUrl}
            disabled={isSaving}
            className="btn-secondary"
          >
            {isSaving ? 'Generating...' : 'Share Config'}
          </button>
        </div>
      </div>
    </ConfigContext.Provider>
  );
}
```

## 8. Authentication & Authorization

### Clerk Implementation

#### Configuration
```typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: 'dark',
        variables: {
          colorPrimary: '#3b82f6',
          colorBackground: '#1e293b'
        }
      }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/onboarding"
    >
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

#### Protected Routes
```typescript
// middleware.ts
import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/', '/import', '/api/events'],
  ignoredRoutes: ['/api/webhook'],
  afterAuth(auth, req) {
    // Redirect logged out users to sign-in page
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
};
```

#### Session Management
```typescript
// lib/auth.ts
import { currentUser } from '@clerk/nextjs';

export async function getAuthenticatedUser() {
  const user = await currentUser();
  
  if (!user) {
    return null;
  }
  
  // Get or create user in our database
  const dbUser = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, user.id))
    .limit(1);
    
  if (!dbUser.length) {
    // Create new user
    await db.insert(users).values({
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      createdAt: new Date()
    });
  }
  
  return {
    ...user,
    dbId: dbUser[0]?.id
  };
}
```

## 9. Data Flow

### Server/Client Data Passing

#### Using Server Actions
```typescript
// app/actions/events.ts
'use server';

export async function refreshEvents(sportId?: string) {
  const user = await getAuthenticatedUser();
  
  // Trigger background job
  await eventQueue.add('refresh-events', {
    sportId,
    userId: user?.dbId,
    timestamp: new Date()
  });
  
  revalidatePath('/');
  
  return { success: true };
}

// Client component
export function RefreshButton() {
  const [isPending, startTransition] = useTransition();
  
  const handleRefresh = () => {
    startTransition(async () => {
      await refreshEvents();
    });
  };
  
  return (
    <button
      onClick={handleRefresh}
      disabled={isPending}
      className="btn-secondary"
    >
      {isPending ? <Spinner /> : <RefreshCw />}
      Refresh
    </button>
  );
}
```

### State Management Architecture

#### Global State with Zustand
```typescript
// stores/config.ts
interface ConfigStore {
  config: UserConfig;
  isLoading: boolean;
  error: string | null;
  updateConfig: (updates: Partial<UserConfig>) => void;
  loadConfig: () => Promise<void>;
  syncConfig: () => Promise<void>;
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
  config: getDefaultConfig(),
  isLoading: false,
  error: null,
  
  updateConfig: (updates) => {
    set(state => ({
      config: {
        ...state.config,
        ...updates,
        version: state.config.version + 1
      }
    }));
  },
  
  loadConfig: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Try local storage first
      const localConfig = localStorage.getItem(CONFIG_KEY);
      if (localConfig) {
        set({ config: JSON.parse(localConfig) });
      }
      
      // Then try server if authenticated
      const user = await getCurrentUser();
      if (user) {
        const serverConfig = await fetchUserConfig();
        if (serverConfig) {
          set({ config: serverConfig });
        }
      }
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  
  syncConfig: async () => {
    const { config } = get();
    
    try {
      await saveUserConfig(config);
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
}));
```

#### React Query for Server State
```typescript
// hooks/useEvents.ts
export function useEvents(filters?: EventFilters) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => fetchEvents(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: (data) => {
      // Refetch more frequently if live events
      const hasLiveEvents = data?.some(e => e.status === 'live');
      return hasLiveEvents ? 30 * 1000 : false; // 30 seconds
    }
  });
}

// Optimistic updates
export function useSetReminder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ eventId, time }: SetReminderParams) => 
      createReminder(eventId, time),
      
    onMutate: async ({ eventId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['reminders']);
      
      // Snapshot previous value
      const previousReminders = queryClient.getQueryData(['reminders']);
      
      // Optimistically update
      queryClient.setQueryData(['reminders'], old => [
        ...old,
        { eventId, status: 'pending' }
      ]);
      
      return { previousReminders };
    },
    
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['reminders'], context.previousReminders);
    },
    
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries(['reminders']);
    }
  });
}
```

## 10. Stripe Integration

### Payment Flow Diagram
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │     │   Next.js   │     │   Stripe    │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                    │
       │  Select Plan      │                    │
       ├──────────────────►│                    │
       │                   │                    │
       │                   │ Create Checkout    │
       │                   ├───────────────────►│
       │                   │                    │
       │                   │ Checkout Session   │
       │                   │◄───────────────────┤
       │                   │                    │
       │  Redirect to      │                    │
       │◄──────────────────┤                    │
       │  Checkout         │                    │
       │                   │                    │
       │  Complete Payment │                    │
       ├───────────────────┼───────────────────►│
       │                   │                    │
       │                   │    Webhook Event   │
       │                   │◄───────────────────┤
       │                   │                    │
       │                   │ Update Database    │
       │                   ├────────┐           │
       │                   │        │           │
       │                   │◄───────┘           │
       │                   │                    │
       │  Access Granted   │                    │
       │◄──────────────────┤                    │
```

### Product/Price Configuration
```typescript
// config/stripe.ts
export const STRIPE_PRODUCTS = {
  FREE: {
    name: 'Free',
    features: [
      '3 sports',
      '5 reminders per month',
      'Local storage only',
      '7-day event history'
    ],
    limits: {
      sports: 3,
      remindersPerMonth: 5,
      historyDays: 7,
      devices: 1
    }
  },
  
  PRO: {
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    name: 'Pro',
    price: 4.99,
    features: [
      'Unlimited sports',
      'Unlimited reminders',
      'Cloud sync',
      '30-day event history',
      'Priority notifications',
      'iCal export'
    ],
    limits: {
      sports: -1, // unlimited
      remindersPerMonth: -1,
      historyDays: 30,
      devices: 5
    }
  },
  
  TEAM: {
    priceId: process.env.STRIPE_TEAM_PRICE_ID,
    name: 'Team',
    price: 19.99,
    features: [
      'Everything in Pro',
      'Shared configurations',
      'Team management',
      'API access',
      'Custom integrations',
      'Priority support'
    ],
    limits: {
      sports: -1,
      remindersPerMonth: -1,
      historyDays: 365,
      devices: -1,
      teamMembers: 10
    }
  }
};
```

### Webhook Handling
```typescript
// app/api/webhook/stripe/route.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return new Response('Webhook Error', { status: 400 });
  }
  
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCancel(subscription);
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }
    }
    
    return new Response('Webhook processed', { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response('Webhook processing failed', { status: 500 });
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  if (!userId) return;
  
  // Update user subscription in database
  await db
    .update(users)
    .set({
      stripeCustomerId: session.customer as string,
      subscriptionId: session.subscription as string,
      subscriptionStatus: 'active',
      subscriptionTier: session.metadata?.tier || 'pro',
      subscriptionEndDate: new Date(session.expires_at * 1000)
    })
    .where(eq(users.clerkId, userId));
    
  // Send welcome email
  await sendEmail({
    to: session.customer_email!,
    subject: 'Welcome to Sports Tracker Pro!',
    template: 'subscription-welcome',
    data: {
      name: session.customer_details?.name,
      tier: session.metadata?.tier
    }
  });
}
```

## 11. Analytics

### Analytics Strategy

#### Event Tracking
```typescript
// lib/analytics.ts
interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: Date;
}

class Analytics {
  private posthog: PostHog | null = null;
  
  initialize(userId?: string) {
    if (typeof window === 'undefined') return;
    
    this.posthog = posthogClient;
    
    if (userId) {
      this.identify(userId);
    }
  }
  
  identify(userId: string, properties?: Record<string, any>) {
    this.posthog?.identify(userId, {
      ...properties,
      app_version: process.env.NEXT_PUBLIC_APP_VERSION,
      platform: this.getPlatform()
    });
  }
  
  track(event: string, properties?: Record<string, any>) {
    // Add common properties
    const enrichedProps = {
      ...properties,
      timestamp: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
    
    this.posthog?.capture(event, enrichedProps);
    
    // Also log to our backend for custom analytics
    fetch('/api/analytics', {
      method: 'POST',
      body: JSON.stringify({ event, properties: enrichedProps })
    });
  }
  
  // Predefined events
  trackEventView(eventId: string, sport: string) {
    this.track('event_viewed', { eventId, sport });
  }
  
  trackReminderSet(eventId: string, reminderTime: string) {
    this.track('reminder_set', { eventId, reminderTime });
  }
  
  trackConfigShared(method: 'url' | 'collaborative') {
    this.track('config_shared', { method });
  }
  
  trackSportToggled(sport: string, enabled: boolean) {
    this.track('sport_toggled', { sport, enabled });
  }
}

export const analytics = new Analytics();
```

#### Custom Properties
```typescript
// Analytics properties to track
interface UserProperties {
  // User preferences
  sports_count: number;
  teams_count: number;
  reminders_active: number;
  spoiler_mode: boolean;
  theme: 'light' | 'dark';
  
  // Usage metrics
  days_active: number;
  events_viewed_total: number;
  reminders_set_total: number;
  config_shares_total: number;
  
  // Platform
  primary_platform: 'web' | 'ios' | 'android' | 'desktop';
  devices_count: number;
  
  // Subscription
  subscription_tier: 'free' | 'pro' | 'team';
  subscription_start_date?: string;
  
  // Engagement
  favorite_sport?: string;
  most_tracked_team?: string;
  avg_session_duration?: number;
}

// Track user properties on significant events
export async function updateUserProperties(userId: string) {
  const properties = await calculateUserProperties(userId);
  analytics.posthog?.people.set(userId, properties);
}
```

## 12. Testing

### Unit Tests with Jest

#### Event Utils Testing
```typescript
// __tests__/utils/events.test.ts
import { 
  groupEventsByDate, 
  isEventLive, 
  calculateReminderTime,
  sortEventsByPriority 
} from '@/lib/utils/events';

describe('Event Utils', () => {
  describe('groupEventsByDate', () => {
    it('should group events by date correctly', () => {
      const events = [
        { 
          id: '1', 
          startTime: new Date('2025-01-15T10:00:00Z'),
          title: 'Event 1'
        },
        { 
          id: '2', 
          startTime: new Date('2025-01-15T14:00:00Z'),
          title: 'Event 2'
        },
        { 
          id: '3', 
          startTime: new Date('2025-01-16T10:00:00Z'),
          title: 'Event 3'
        }
      ];
      
      const grouped = groupEventsByDate(events);
      
      expect(Object.keys(grouped)).toHaveLength(2);
      expect(grouped['2025-01-15']).toHaveLength(2);
      expect(grouped['2025-01-16']).toHaveLength(1);
    });
    
    it('should handle empty array', () => {
      expect(groupEventsByDate([])).toEqual({});
    });
    
    it('should handle timezone conversions', () => {
      const event = {
        id: '1',
        startTime: new Date('2025-01-15T23:30:00Z'),
        timezone: 'America/New_York'
      };
      
      const grouped = groupEventsByDate([event], 'America/New_York');
      expect(Object.keys(grouped)[0]).toBe('2025-01-15'); // Should be 15th in NY
    });
  });
  
  describe('isEventLive', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    
    afterEach(() => {
      jest.useRealTimers();
    });
    
    it('should return true for ongoing events', () => {
      const now = new Date('2025-01-15T12:00:00Z');
      jest.setSystemTime(now);
      
      const event = {
        startTime: new Date('2025-01-15T11:00:00Z'),
        endTime: new Date('2025-01-15T13:00:00Z'),
        status: 'live'
      };
      
      expect(isEventLive(event)).toBe(true);
    });
    
    it('should handle events without end time', () => {
      const now = new Date('2025-01-15T12:00:00Z');
      jest.setSystemTime(now);
      
      const event = {
        startTime: new Date('2025-01-15T11:00:00Z'),
        status: 'live',
        estimatedDuration: 120 // minutes
      };
      
      expect(isEventLive(event)).toBe(true);
    });
  });
});
```

#### Config Store Testing
```typescript
// __tests__/stores/config.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useConfigStore } from '@/stores/config';

describe('Config Store', () => {
  beforeEach(() => {
    localStorage.clear();
    useConfigStore.setState(useConfigStore.getInitialState());
  });
  
  it('should update config correctly', () => {
    const { result } = renderHook(() => useConfigStore());
    
    act(() => {
      result.current.updateConfig({
        selectedSports: ['f1', 'motogp']
      });
    });
    
    expect(result.current.config.selectedSports).toEqual(['f1', 'motogp']);
    expect(result.current.config.version).toBe(2);
  });
  
  it('should persist to localStorage', async () => {
    const { result } = renderHook(() => useConfigStore());
    
    act(() => {
      result.current.updateConfig({
        hideSpoilers: false
      });
    });
    
    const saved = JSON.parse(localStorage.getItem('sports-tracker-config')!);
    expect(saved.hideSpoilers).toBe(false);
  });
});
```

### E2E Tests with Playwright

#### Critical User Flows
```typescript
// e2e/flows/event-reminder.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Event Reminder Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
  
  test('should set reminder for upcoming event', async ({ page }) => {
    // Find first upcoming event
    const eventCard = page.locator('[data-testid="event-card"]')
      .filter({ hasText: 'Scheduled' })
      .first();
      
    await expect(eventCard).toBeVisible();
    
    // Click reminder button
    const reminderButton = eventCard.locator('[data-testid="reminder-button"]');
    await reminderButton.click();
    
    // Select reminder time
    const reminderMenu = page.locator('[data-testid="reminder-menu"]');
    await expect(reminderMenu).toBeVisible();
    
    await reminderMenu.locator('text="1 hour before"').click();
    
    // Verify reminder set
    await expect(reminderButton).toHaveAttribute('data-active', 'true');
    
    // Check notification
    const notification = page.locator('[data-testid="notification"]');
    await expect(notification).toContainText('Reminder set successfully');
  });
  
  test('should handle reminder conflicts', async ({ page }) => {
    // Set multiple reminders for same time
    const events = page.locator('[data-testid="event-card"]')
      .filter({ hasText: '14:00' });
      
    const count = await events.count();
    expect(count).toBeGreaterThan(1);
    
    // Set reminders for all
    for (let i = 0; i < count; i++) {
      await events.nth(i).locator('[data-testid="reminder-button"]').click();
      await page.locator('text="15 minutes before"').click();
    }
    
    // Check conflict warning
    const warning = page.locator('[data-testid="reminder-conflict-warning"]');
    await expect(warning).toBeVisible();
    await expect(warning).toContainText(`${count} reminders at the same time`);
  });
});
```

#### Cross-Platform Sync Test
```typescript
// e2e/flows/config-sync.spec.ts
test.describe('Configuration Sync', () => {
  test('should sync config across devices', async ({ browser }) => {
    // Device 1: Set configuration
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    
    await page1.goto('/settings');
    await page1.locator('text="Formula 1"').click();
    await page1.locator('text="MotoGP"').click();
    await page1.locator('[data-testid="save-config"]').click();
    
    // Get share URL
    await page1.locator('[data-testid="share-config"]').click();
    const shareUrl = await page1.locator('[data-testid="share-url-input"]')
      .inputValue();
    
    // Device 2: Import configuration
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    
    await page2.goto(shareUrl);
    await expect(page2.locator('h1')).toContainText('Import Configuration');
    
    // Preview shows correct sports
    await expect(page2.locator('[data-testid="config-preview"]'))
      .toContainText('Formula 1');
    await expect(page2.locator('[data-testid="config-preview"]'))
      .toContainText('MotoGP');
      
    // Import
    await page2.locator('[data-testid="import-config"]').click();
    
    // Verify imported
    await page2.goto('/');
    const events = page2.locator('[data-testid="event-card"]');
    
    // Should only show F1 and MotoGP events
    const eventCount = await events.count();
    for (let i = 0; i < eventCount; i++) {
      const sport = await events.nth(i)
        .locator('[data-testid="sport-badge"]')
        .textContent();
      expect(['F1', 'F2', 'F3', 'MotoGP']).toContain(sport);
    }
  });
});
```

#### Mobile Responsiveness Test
```typescript
// e2e/flows/mobile-responsive.spec.ts
test.describe('Mobile Experience', () => {
  test.use({ 
    viewport: { width: 375, height: 667 }, // iPhone SE
  });
  
  test('should show mobile-optimized navigation', async ({ page }) => {
    await page.goto('/');
    
    // Desktop nav should be hidden
    await expect(page.locator('[data-testid="desktop-nav"]')).toBeHidden();
    
    // Mobile nav should be visible
    const mobileNav = page.locator('[data-testid="mobile-nav"]');
    await expect(mobileNav).toBeVisible();
    
    // Test hamburger menu
    await page.locator('[data-testid="menu-toggle"]').click();
    const drawer = page.locator('[data-testid="nav-drawer"]');
    await expect(drawer).toBeVisible();
    
    // Navigate to settings
    await drawer.locator('text="Settings"').click();
    await expect(page).toHaveURL('/settings');
    await expect(drawer).toBeHidden();
  });
  
  test('should handle touch interactions', async ({ page }) => {
    await page.goto('/');
    
    const eventCard = page.locator('[data-testid="event-card"]').first();
    
    // Swipe to reveal actions
    await eventCard.dragTo(eventCard, {
      sourcePosition: { x: 300, y: 50 },
      targetPosition: { x: 100, y: 50 }
    });
    
    const actions = eventCard.locator('[data-testid="swipe-actions"]');
    await expect(actions).toBeVisible();
    
    // Tap reminder action
    await actions.locator('[data-testid="quick-reminder"]').click();
    await expect(page.locator('[data-testid="notification"]'))
      .toContainText('Reminder set');
  });
});
```

This completes the comprehensive technical specification for the Sports Event Tracker. The specification covers all major aspects including system architecture, detailed feature implementations, database design, API integrations, component architecture, authentication, payment processing, analytics, and testing strategies. Each section provides concrete implementation details that can be directly used by developers to build the application.