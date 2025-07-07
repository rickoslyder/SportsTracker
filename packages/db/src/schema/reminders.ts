import {
  pgTable,
  uuid,
  integer,
  timestamp,
  pgEnum,
  boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { events } from './events';
import { userConfigs } from './users';

export const reminderTypeEnum = pgEnum('reminder_type', ['email', 'push', 'sms']);
export const reminderStatusEnum = pgEnum('reminder_status', ['pending', 'sent', 'failed', 'cancelled']);

export const reminders = pgTable('reminders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userConfigId: uuid('user_config_id')
    .notNull()
    .references(() => userConfigs.id, { onDelete: 'cascade' }),
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  type: reminderTypeEnum('type').notNull(),
  // When to send the reminder (e.g., 15 minutes before event)
  minutesBefore: integer('minutes_before').notNull().default(15),
  scheduledFor: timestamp('scheduled_for', { withTimezone: true }).notNull(),
  status: reminderStatusEnum('status').notNull().default('pending'),
  sentAt: timestamp('sent_at', { withTimezone: true }),
  failureReason: timestamp('failure_reason', { withTimezone: true }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const remindersRelations = relations(reminders, ({ one }) => ({
  userConfig: one(userConfigs, {
    fields: [reminders.userConfigId],
    references: [userConfigs.id],
  }),
  event: one(events, {
    fields: [reminders.eventId],
    references: [events.id],
  }),
}));

export type Reminder = typeof reminders.$inferSelect;
export type NewReminder = typeof reminders.$inferInsert;