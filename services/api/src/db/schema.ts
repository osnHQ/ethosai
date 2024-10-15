import { pgTable, serial, text, integer, timestamp, numeric, json, foreignKey, boolean, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', { 
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  profession: text('profession').notNull(),
  location: text('location').notNull(),
  bio: text('bio').notNull(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  handles: json('handles').notNull(),
  avatar: text('avatar').notNull(),
  apiKey: json('api_key').notNull(),
  reviews: json('reviews').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  configs: json('configs').notNull(),
  evaluations: json('evaluations').notNull(),
  reports: json('reports').notNull(),
  settings: json('settings').notNull(),
});

export const configs = pgTable('configs', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  category: text('category').notNull(),
  tags: json('tags').notNull(),
  reviewStatus: text('review_status').notNull(),
  rating: integer('rating').notNull().default(0), 
  dateSubmitted: timestamp('date_submitted').notNull(),
  lastReviewed: timestamp('last_reviewed').notNull(),
  submittedBy: json('submitted_by').notNull(),
  questionAnswerPairs: json('questionAnswerPairs').notNull().default([]), 
  fileContents: text('file_contents').notNull().default('No file uploaded'), 
});

export const models = pgTable('models', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  company: text('company'),
  description: text('description'),
  image: text('image'),
  tags: json('tags'),
  createdAt: timestamp('created_at').defaultNow()
});

export const evaluations = pgTable('evaluations', {
  id: serial('id').primaryKey(),
  model: text('model').notNull(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  output: text('output'),
  score: numeric('score', { precision: 5, scale: 4 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const review = pgTable('reviews', {
  id: serial('id').primaryKey(),
  configId: integer('config_id').references(() => configs.id),
  evaluationId: integer('evaluation_id').references(() => evaluations.id),
  content: text('content'),
  createdAt: timestamp('created_at').defaultNow()
});

export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  evaluationId: integer('evaluation_id').references(() => evaluations.id),
  content: text('content'),
  createdAt: timestamp('created_at').defaultNow()
});

// Api Key Table
export const apiKey = pgTable(
  "api_key",
  {
    id: serial("id").primaryKey(),
    clientId: integer("client_id").notNull(),
    apiKey: varchar("api_key", { length: 255 }).notNull().unique(),
    queryCount: integer("query_count").default(0).notNull(),
    isActive: boolean("is_active").notNull().default(true),
    isDeleted: boolean("is_deleted").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    clientFk: foreignKey({
      columns: [table.clientId],
      foreignColumns: [users.id],
      name: "api_key_client_fk",
    }),
  })
);
