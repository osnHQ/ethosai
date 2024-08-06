import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { neon } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { models, evaluations, results } from './db/schema';
import { eq } from 'drizzle-orm';
import OpenAI from 'openai';


export type Env = {
  DATABASE_URL: string;
  NODE_ENV: string;
  OPENAI_API_KEY: string;
};


type Model = {
  id: number;
  name: string;
  description?: string;
};

type Evaluation = {
  id: number;
  modelId: number;
  name: string;
  description?: string;
  evaluator: string;
};

type Result = {
  id: number;
  evaluationId: number;
  score: string;
  metadata?: Record<string, unknown>;
};

const app = new Hono<{ Bindings: Env }>();

const createDbConnection = (databaseUrl: string): NeonHttpDatabase => {
  const sql = neon(databaseUrl);
  return drizzle(sql);
};

const createOpenAIClient = (apiKey: string): OpenAI => {
  return new OpenAI({ apiKey });
};

app.onError((err: Error, c) => {
  console.error(`${err}`);
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  return c.json({ error: 'Internal Server Error' }, 500);
});

app.get('/', (c) => c.json({ message: 'Welcome to EthosAI API!' }));

app.get('/models', async (c) => {
  const db = createDbConnection(c.env.DATABASE_URL);
  const allModels = await db.select().from(models);
  return c.json(allModels);
});

app.get('/models/:id', async (c) => {
  const db = createDbConnection(c.env.DATABASE_URL);
  const id = parseInt(c.req.param('id'), 10);
  if (isNaN(id)) {
    throw new HTTPException(400, { message: 'Invalid ID' });
  }
  const model = await db.select().from(models).where(eq(models.id, id)).limit(1);
  if (model.length === 0) {
    throw new HTTPException(404, { message: 'Model not found' });
  }
  return c.json(model[0]);
});

app.post('/models', zValidator('json', z.object({
  name: z.string(),
  description: z.string().optional(),
})), async (c) => {
  const db = createDbConnection(c.env.DATABASE_URL);
  const body = c.req.valid('json');
  const newModel = await db.insert(models).values(body).returning();
  return c.json(newModel[0], 201);
});

app.get('/evaluations', async (c) => {
  const db = createDbConnection(c.env.DATABASE_URL);
  const allEvaluations = await db.select().from(evaluations);
  return c.json(allEvaluations);
});

app.get('/evaluations/:id', async (c) => {
  const db = createDbConnection(c.env.DATABASE_URL);
  const id = Number(c.req.param('id'));
  const evaluation = await db.select().from(evaluations).where(eq(evaluations.id, id)).limit(1);
  if (evaluation.length === 0) {
    throw new HTTPException(404, { message: 'Evaluation not found' });
  }
  return c.json(evaluation[0]);
});

app.post('/evaluations', zValidator('json', z.object({
  modelId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  evaluator: z.string(),
})), async (c) => {
  const db = createDbConnection(c.env.DATABASE_URL);
  const body = c.req.valid('json');
  const newEvaluation = await db.insert(evaluations).values({
    ...body,
    modelId: Number(body.modelId),
  }).returning();
  return c.json(newEvaluation[0], 201);
});

app.get('/results', async (c) => {
  const db = createDbConnection(c.env.DATABASE_URL);
  const allResults = await db.select().from(results);
  return c.json(allResults);
});

app.get('/results/:id', async (c) => {
  const db = createDbConnection(c.env.DATABASE_URL);
  const id = Number(c.req.param('id'));
  const result = await db.select().from(results).where(eq(results.id, id)).limit(1);
  if (result.length === 0) {
    throw new HTTPException(404, { message: 'Result not found' });
  }
  return c.json(result[0]);
});

app.post('/results', zValidator('json', z.object({
  evaluationId: z.string(),
  score: z.number(),
  metadata: z.record(z.unknown()).optional(),
})), async (c) => {
  const db = createDbConnection(c.env.DATABASE_URL);
  const body = c.req.valid('json');

  const resultData: Omit<Result, 'id'> = {
    evaluationId: Number(body.evaluationId),
    score: String(body.score),
    metadata: body.metadata,
  };

  const newResult = await db.insert(results).values(resultData).returning();
  return c.json(newResult[0], 201);
});

app.post('/generate-text', zValidator('json', z.object({
  prompt: z.string(),
  maxTokens: z.number().optional(),
  temperature: z.number().min(0).max(1).optional(),
})), async (c) => {
  const openai = createOpenAIClient(c.env.OPENAI_API_KEY);
  const { prompt, maxTokens = 100, temperature = 0.7 } = c.req.valid('json');

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens,
      temperature: temperature,
    });

    return c.json({
      generatedText: response.choices[0].message.content,
      usage: response.usage,
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new HTTPException(500, { message: 'Error generating text' });
  }
});

export default app;