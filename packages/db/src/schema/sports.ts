import { pgTable, serial, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const sports = pgTable('sports', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  description: varchar('description', { length: 500 }),
  color: varchar('color', { length: 7 }).notNull(), // Hex color
  icon: varchar('icon', { length: 50 }), // Icon name or URL
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const sportsRelations = relations(sports, ({ many }) => ({
  events: many(events),
  teams: many(teams),
}));

// Pre-defined sports data
export const SPORTS_DATA = [
  {
    name: 'Formula 1',
    slug: 'f1',
    description: 'FIA Formula One World Championship',
    color: '#e10600',
    icon: 'f1',
  },
  {
    name: 'Formula E',
    slug: 'formula-e',
    description: 'ABB FIA Formula E World Championship',
    color: '#00a0de',
    icon: 'formula-e',
  },
  {
    name: 'MotoGP',
    slug: 'motogp',
    description: 'FIM MotoGP World Championship',
    color: '#cc0000',
    icon: 'motogp',
  },
  {
    name: 'UFC',
    slug: 'ufc',
    description: 'Ultimate Fighting Championship',
    color: '#d20a0a',
    icon: 'ufc',
  },
  {
    name: 'Football',
    slug: 'football',
    description: 'Major football leagues and tournaments',
    color: '#088a08',
    icon: 'football',
  },
  {
    name: 'IndyCar',
    slug: 'indycar',
    description: 'NTT IndyCar Series',
    color: '#003f7f',
    icon: 'indycar',
  },
  {
    name: 'WEC/IMSA',
    slug: 'wec-imsa',
    description: 'FIA World Endurance Championship & IMSA SportsCar Championship',
    color: '#004c8c',
    icon: 'wec',
  },
] as const;

// Import events and teams to avoid circular dependency
import { events } from './events';
import { teams } from './teams';

export type Sport = typeof sports.$inferSelect;
export type NewSport = typeof sports.$inferInsert;