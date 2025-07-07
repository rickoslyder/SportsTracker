# 🏆 Sports Event Tracker

A modern, multi-platform sports event tracking application that ensures you never miss your favorite sporting moments. Track events across Formula 1, MotoGP, UFC, and more with smart reminders and timezone management.

![Sports Event Tracker](https://img.shields.io/badge/Sports-Event%20Tracker-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)

## ✨ Features

### 🎯 Core Features
- **Multi-Sport Support**: Track F1, Formula E, MotoGP, UFC, Boxing, WWE, IndyCar, WEC/IMSA, and major football leagues
- **Smart Reminders**: Customizable notifications via email, SMS, and push notifications
- **Timezone Intelligence**: Automatic timezone conversion for international events
- **No-Spoiler Mode**: Hide results until you're ready to see them
- **Multi-Platform**: Web, iOS, Android, and desktop applications
- **Calendar Sync**: Export events to Google Calendar, Apple Calendar, and more

### 🚀 Premium Features
- **Unlimited Sports Tracking**: Follow all available sports
- **Advanced Notifications**: SMS alerts and custom reminder times
- **Multi-Device Sync**: Keep your preferences synchronized across devices
- **API Access**: Build your own integrations
- **Priority Support**: Get help when you need it

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Animations**: Framer Motion
- **UI Components**: Custom component library with shadcn/ui base

### Backend
- **Database**: PostgreSQL with Drizzle ORM
- **Caching**: Redis
- **Authentication**: Clerk
- **Sync**: Supabase
- **Payments**: Stripe

### Infrastructure
- **Container**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry, PostHog

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- PostgreSQL 14+
- Redis 6+
- Docker (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rickoslyder/SportsTracker.git
cd SportsTracker
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Set up the database:
```bash
pnpm db:push
pnpm db:seed
```

5. Start the development server:
```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📱 Project Structure

```
sports-event-tracker/
├── apps/
│   ├── web/          # Next.js web application
│   ├── mobile/       # React Native mobile app
│   ├── desktop/      # Electron desktop app
│   └── api/          # Backend API
├── packages/
│   ├── ui/           # Shared UI components
│   ├── types/        # TypeScript types
│   ├── services/     # Business logic
│   └── config/       # Shared configuration
├── infrastructure/
│   ├── docker/       # Docker configurations
│   ├── k8s/          # Kubernetes manifests
│   └── terraform/    # Infrastructure as code
└── docs/             # Documentation
```

## 🏗️ Architecture

### Data Flow
1. **External APIs** → Scheduled sync jobs fetch event data
2. **Redis Cache** → Temporary storage for API responses
3. **PostgreSQL** → Persistent storage with optimized queries
4. **API Layer** → RESTful endpoints with caching
5. **Client Apps** → Real-time updates via React Query

### Key Design Decisions
- **Monorepo Structure**: Shared code and consistent tooling
- **Anonymous-First**: Optional authentication for enhanced features
- **Local-First**: Offline support with background sync
- **Performance**: Aggressive caching and optimistic updates

## 🧪 Testing

Run the test suite:

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

## 📊 Database Schema

Key tables:
- `events` - Sports events with timezone-aware timestamps
- `sports` - Supported sports configuration
- `teams` - Teams/competitors per sport
- `user_configs` - User preferences and settings
- `reminders` - Notification preferences
- `api_cache` - External API response cache

## 🔄 Sync System

The application uses a sophisticated sync system to keep event data up-to-date:

- **Scheduled Jobs**: Cron-based updates for each sport
- **Smart Caching**: Redis-based deduplication
- **Error Recovery**: Automatic retries with exponential backoff
- **Monitoring**: Health checks and alerting

See [docs/SYNC_SCRIPTS.md](docs/SYNC_SCRIPTS.md) for detailed documentation.

## 🎨 Design System

- **Colors**: Sport-specific color palette with consistent gradients
- **Typography**: Inter font with clear hierarchy
- **Components**: Reusable, accessible UI components
- **Animations**: Smooth transitions with Framer Motion
- **Dark Mode**: Full dark mode support

## 🚢 Deployment

### Production Build

```bash
# Build all applications
pnpm build

# Build specific app
pnpm build:web
```

### Docker

```bash
# Build and run with Docker Compose
docker-compose up -d

# Production deployment
docker build -t sports-tracker .
docker run -p 3000:3000 sports-tracker
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Event data providers for reliable sports information
- The open-source community for amazing tools and libraries
- Our users for feedback and support

## 📞 Support

- **Documentation**: [https://sportstracker.com/docs](https://sportstracker.com/docs)
- **Help Center**: [https://sportstracker.com/help](https://sportstracker.com/help)
- **Email**: support@sportstracker.com
- **Status**: [https://status.sportstracker.com](https://status.sportstracker.com)

---

Built with ❤️ by sports fans, for sports fans. Never miss a moment!