import { pgTable, varchar, text, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';

export const apiCache = pgTable('api_cache', {
  key: varchar('key', { length: 500 }).primaryKey(),
  endpoint: varchar('endpoint', { length: 500 }).notNull(),
  response: jsonb('response').notNull(),
  statusCode: integer('status_code').notNull(),
  headers: jsonb('headers').default({}),
  ttl: integer('ttl').notNull(), // Time to live in seconds
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type ApiCache = typeof apiCache.$inferSelect;
export type NewApiCache = typeof apiCache.$inferInsert;