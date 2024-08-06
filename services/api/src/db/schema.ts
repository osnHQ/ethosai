import { pgTable, serial, text, varchar, integer, timestamp, numeric } from 'drizzle-orm/pg-core';

export const models = pgTable('models', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow()
});

export const evaluations = pgTable('evaluations', {
  id: serial('id').primaryKey(),
  modelId: integer('model_id').references(() => models.id),
  evaluator: varchar('evaluator', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const results = pgTable('results', {
  id: serial('id').primaryKey(),
  evaluationId: integer('evaluation_id').references(() => evaluations.id),
  output: text('output'),
  score: numeric('score', { precision: 5, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow()
});