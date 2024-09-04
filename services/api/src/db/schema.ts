import { pgTable, serial, text, integer, timestamp, numeric, json } from 'drizzle-orm/pg-core';

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
  rating: numeric('rating').notNull(),
  reviews: json('reviews').notNull(),
  dateSubmitted: timestamp('date_submitted').notNull(),
  lastReviewed: timestamp('last_reviewed').notNull(),
  submittedBy: json('submitted_by').notNull(),
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
