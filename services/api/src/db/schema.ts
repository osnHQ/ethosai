import { pgTable, serial, text, varchar, integer, timestamp, numeric } from 'drizzle-orm/pg-core';

export const models = pgTable('models', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow()
});

export const evaluations = pgTable('evaluations', {
  id: serial('id').primaryKey(),
  model: varchar('model', { length: 255 }).notNull().references(() => models.name),
  evaluator: varchar('evaluator', { length: 255 }).notNull(),
  output: text('output'),
  score: numeric('score', { precision: 5, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  evaluationId: integer('evaluation_id').references(() => evaluations.id),
  createdAt: timestamp('created_at').defaultNow()
});
