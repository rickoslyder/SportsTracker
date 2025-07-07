# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a multi-platform sports event tracking application currently in the planning phase. The codebase follows a monorepo structure supporting web (Next.js), mobile (React Native), and desktop (Electron) platforms.

## Architecture

The project uses a monorepo structure:
- `apps/` - Platform-specific applications (web, mobile, desktop, api)
- `packages/` - Shared code (types, UI components, services)
- `infrastructure/` - Docker, Kubernetes, and Terraform configurations

## Key Technologies

**Frontend:**
- Next.js with App Router for web
- React Native for mobile
- Electron for desktop
- Tailwind CSS for styling
- Zustand for state management
- React Query for server state

**Backend:**
- Node.js/Express or Python/FastAPI
- PostgreSQL with Drizzle ORM
- Redis for caching
- Supabase for sync functionality

## Development Commands

Once the project is initialized, typical commands will include:

```bash
# Install dependencies (monorepo)
npm install

# Run development servers
npm run dev:web      # Next.js web app
npm run dev:mobile   # React Native app
npm run dev:desktop  # Electron app
npm run dev:api      # Backend API

# Build applications
npm run build:web
npm run build:mobile
npm run build:desktop
npm run build:api

# Run tests
npm run test         # Run all tests
npm run test:unit    # Unit tests only
npm run test:e2e     # E2E tests with Playwright

# Database operations
npm run db:migrate   # Run migrations
npm run db:seed      # Seed initial data

# Linting and formatting
npm run lint
npm run format
```

## Testing Strategy

- **Unit Tests**: Jest with 80% coverage goal
- **E2E Tests**: Playwright for web, platform-specific for mobile/desktop
- **API Testing**: Mock Service Worker for external API mocking
- Focus areas: Data transformation, timezone handling, configuration merging

## Database Schema

Core tables include:
- `events` - Sports events with timezone-aware timestamps
- `sports` - Pre-seeded with 7 sports (F1, Formula E, MotoGP, UFC, etc.)
- `teams` - Team/competitor data per sport
- `user_configs` - Device-based configurations
- `reminders` - User notification preferences
- `api_cache` - Cached external API responses

## API Patterns

RESTful endpoints organized by resource:
- `/events` - Event listings with filtering
- `/config` - User configuration management
- `/reminders` - Notification preferences
- Server Actions for Next.js integration

## State Management

- **Client State**: Zustand stores for UI state
- **Server State**: React Query for data fetching
- **Local Storage**: Device preferences
- **Sync**: Supabase for cross-device configuration

## Authentication

- Anonymous-first approach using Clerk
- Optional authentication for sync features
- Social logins (Google, Apple)
- Protected routes only for sync/premium features

## Key Development Patterns

1. **Component Architecture**: Server Components for data, Client Components for interactivity
2. **Data Fetching**: Scheduled jobs with caching layer
3. **Error Handling**: Network fallbacks, empty states, retry logic
4. **Notifications**: Queue-based processing with platform-specific implementations
5. **Configuration**: Local-first with optional cloud sync

## External Services

- **Clerk**: Authentication
- **Stripe**: Payment processing
- **Supabase**: Data sync
- **SendGrid/Twilio**: Notifications
- **PostHog**: Analytics
- **Sentry**: Error tracking

## Important Notes

- All timestamps must be timezone-aware
- "No spoiler" mode is a core feature - hide results based on user preference
- Support offline functionality where possible
- Implement optimistic updates for better UX
- Follow mobile-first responsive design