import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  jsonb,
  boolean,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { reminders } from './reminders';

export const subscriptionTierEnum = pgEnum('subscription_tier', ['free', 'premium']);

export const userConfigs = pgTable('user_configs', {
  id: uuid('id').primaryKey().defaultRandom(),
  // Device-based ID (anonymous users)
  deviceId: varchar('device_id', { length: 100 }).unique(),
  // Clerk user ID (authenticated users)
  userId: varchar('user_id', { length: 100 }).unique(),
  // User email for notifications
  userEmail: varchar('user_email', { length: 255 }),
  // User preferences
  preferences: jsonb('preferences').notNull().default({
    selectedSports: [],
    favoriteTeams: [],
    notificationSettings: {
      email: false,
      push: false,
      sms: false,
    },
    noSpoilerMode: true,
    timezone: 'UTC',
    language: 'en',
  }),
  // Subscription info
  subscriptionTier: subscriptionTierEnum('subscription_tier').notNull().default('free'),
  subscriptionEndDate: timestamp('subscription_end_date', { withTimezone: true }),
  stripeCustomerId: varchar('stripe_customer_id', { length: 100 }),
  // Sync settings
  lastSyncedAt: timestamp('last_synced_at', { withTimezone: true }),
  syncEnabled: boolean('sync_enabled').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const userConfigsRelations = relations(userConfigs, ({ many }) => ({
  reminders: many(reminders),
}));

export type UserConfig = typeof userConfigs.$inferSelect;
export type NewUserConfig = typeof userConfigs.$inferInsert;
export type UserPreferences = {
  selectedSports: string[];
  favoriteTeams: number[];
  notificationSettings: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  noSpoilerMode: boolean;
  timezone: string;
  language: string;
};