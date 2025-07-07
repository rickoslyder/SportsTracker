import {
  pgTable,
  uuid,
  integer,
  varchar,
  text,
  timestamp,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { sports } from './sports';
import { reminders } from './reminders';

export const eventStatusEnum = pgEnum('event_status', [
  'scheduled',
  'live',
  'finished',
  'cancelled',
  'postponed',
]);

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  sportId: integer('sport_id')
    .notNull()
    .references(() => sports.id),
  league: varchar('league', { length: 100 }).notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description'),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }),
  timezone: varchar('timezone', { length: 50 }).notNull(),
  venue: varchar('venue', { length: 200 }),
  status: eventStatusEnum('status').notNull().default('scheduled'),
  // For multi-session events (e.g., F1 weekend)
  parentEventId: uuid('parent_event_id').references(() => events.id),
  sessionType: varchar('session_type', { length: 50 }), // practice, qualifying, race, etc.
  // External API reference
  externalId: varchar('external_id', { length: 200 }),
  // Flexible metadata for sport-specific data
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const eventsRelations = relations(events, ({ one, many }) => ({
  sport: one(sports, {
    fields: [events.sportId],
    references: [sports.id],
  }),
  parentEvent: one(events, {
    fields: [events.parentEventId],
    references: [events.id],
  }),
  childEvents: many(events),
  reminders: many(reminders),
  eventResults: many(eventResults),
  eventTeams: many(eventTeams),
}));

// Results table for storing event outcomes
export const eventResults = pgTable('event_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  position: integer('position').notNull(),
  teamId: integer('team_id').references(() => teams.id),
  participantName: varchar('participant_name', { length: 200 }),
  points: integer('points'),
  time: varchar('time', { length: 50 }),
  status: varchar('status', { length: 50 }), // finished, dnf, dsq, etc.
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const eventResultsRelations = relations(eventResults, ({ one }) => ({
  event: one(events, {
    fields: [eventResults.eventId],
    references: [events.id],
  }),
  team: one(teams, {
    fields: [eventResults.teamId],
    references: [teams.id],
  }),
}));

// Many-to-many relationship between events and teams
export const eventTeams = pgTable('event_teams', {
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const eventTeamsRelations = relations(eventTeams, ({ one }) => ({
  event: one(events, {
    fields: [eventTeams.eventId],
    references: [events.id],
  }),
  team: one(teams, {
    fields: [eventTeams.teamId],
    references: [teams.id],
  }),
}));

// Import teams to avoid circular dependency
import { teams } from './teams';

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type EventResult = typeof eventResults.$inferSelect;
export type NewEventResult = typeof eventResults.$inferInsert;