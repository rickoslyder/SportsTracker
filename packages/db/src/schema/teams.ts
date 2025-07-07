import { pgTable, serial, integer, varchar, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { sports } from './sports';
import { eventResults, eventTeams } from './events';

export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  sportId: integer('sport_id')
    .notNull()
    .references(() => sports.id),
  name: varchar('name', { length: 200 }).notNull(),
  shortName: varchar('short_name', { length: 50 }),
  country: varchar('country', { length: 100 }),
  logoUrl: text('logo_url'),
  primaryColor: varchar('primary_color', { length: 7 }), // Hex color
  secondaryColor: varchar('secondary_color', { length: 7 }), // Hex color
  // For individual sports (e.g., F1 drivers)
  driverName: varchar('driver_name', { length: 200 }),
  driverNumber: integer('driver_number'),
  // External API reference
  externalId: varchar('external_id', { length: 200 }),
  // Flexible metadata for sport-specific data
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const teamsRelations = relations(teams, ({ one, many }) => ({
  sport: one(sports, {
    fields: [teams.sportId],
    references: [sports.id],
  }),
  eventResults: many(eventResults),
  eventTeams: many(eventTeams),
}));

export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;