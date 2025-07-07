// Export database types
export * from './database.types'

// Re-export database types
export type {
  Sport,
  Event,
  Team,
  UserConfig,
  UserPreferences,
  Reminder,
  EventResult,
  ApiCache,
} from '@sports-tracker/db';

// API Response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Event filters
export interface EventFilters {
  sportId?: number;
  startDate?: Date;
  endDate?: Date;
  status?: 'scheduled' | 'live' | 'finished' | 'cancelled' | 'postponed';
  league?: string;
  teamId?: number;
}

// Notification types
export interface NotificationPayload {
  type: 'reminder' | 'event_update' | 'result';
  eventId: string;
  userId?: string;
  deviceId?: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

// Subscription types
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
}

// Feature flags
export interface FeatureFlags {
  notifications: boolean;
  sync: boolean;
  premium: boolean;
  [key: string]: boolean;
}