import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { apiReference } from '@scalar/hono-api-reference';
import { z } from "zod";
import { models, evaluations, reports } from "./db/schema";
import { eq } from "drizzle-orm";
import { createDbConnection, createOpenAIClient, cosineSimilarity, getEmbedding } from "./utils/functions";

export type Env = {
  DATABASE_URL: string;
  NODE_ENV: string;
  OPENAI_API_KEY: string;
};

const app = new Hono<{ Bindings: Env }>();

app.get(
  '/reference',
  apiReference({
    spec: {
      url: '/openapi.json',
    },
  }),
)

app.onError((err: Error, c) => {
  console.error(`${err}`);
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return c.json({ error: "Internal Server Error" }, 500);
});

app.get("/", (c) => c.json({ message: "Welcome to EthosAI API!" }));

app.get(
  "/generateEmbedding",
  zValidator("query", z.object({ prompt: z.string() })),
  async (c) => {
    const { prompt } = c.req.valid("query");

    const embedding = await getEmbedding(prompt, createOpenAIClient(c.env.OPENAI_API_KEY));

    return c.json(embedding);
  });

app.get(
  "/evaluate",
  zValidator(
    "query",
    z.object({
      question: z.string(),
      answer: z.string(),
      model: z.string(),
    }),
  ),
  async (c) => {
    const openai = createOpenAIClient(c.env.OPENAI_API_KEY);
    const { question, answer, model } = c.req.valid("query");

    const openaiResponse = await openai.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: question }],
      max_tokens: 100,
      temperature: 0.7,
    });

    const generatedResponse = openaiResponse.choices[0].message.content || "";

    const [answerEmbedding, generatedEmbedding] = await Promise.all([
      getEmbedding(answer, openai),
      getEmbedding(generatedResponse, openai),
    ]);

    const similarity = cosineSimilarity(answerEmbedding, generatedEmbedding);

    const db = createDbConnection(c.env.DATABASE_URL);
    const newEvaluation = await db
      .insert(evaluations)
      .values({
        model: model,
        evaluator: "API User",
        output: generatedResponse,
        score: similarity.toString(),
        createdAt: new Date(),
      })
      .returning();

    return c.json({
      question,
      answer,
      generated: generatedResponse,
      similarity,
      evaluationId: newEvaluation[0].id,
    });
  },
);

app.get("/evaluations/:id", async (c) => {
  const db = createDbConnection(c.env.DATABASE_URL);
  const id = Number(c.req.param("id"));
  const evaluation = await db
    .select()
    .from(evaluations)
    .where(eq(evaluations.id, id))
    .limit(1);
  if (evaluation.length === 0) {
    throw new HTTPException(404, { message: "Evaluation not found" });
  }
  return c.json(evaluation[0]);
});

app.get("/reports/:id", async (c) => {
  const db = createDbConnection(c.env.DATABASE_URL);
  const id = Number(c.req.param("id"));
  const report = await db
    .select()
    .from(reports)
    .where(eq(reports.id, id))
    .limit(1);
  if (report.length === 0) {
    throw new HTTPException(404, { message: "Report not found" });
  }
  return c.json(report[0]);
});

app.post(
  "/generate-text",
  zValidator(
    "json",
    z.object({
      prompt: z.string(),
      model: z.string(),
      temperature: z.number().min(0).max(1).optional(),
    }),
  ),
  async (c) => {
    const openai = createOpenAIClient(c.env.OPENAI_API_KEY);
    const { prompt, model, temperature = 0.7 } = c.req.valid("json");

    try {
      const response = await openai.chat.completions.create({
        model: model,
        messages: [{ role: "user", content: prompt }],
        temperature: temperature,
      });

      return c.json({
        generatedText: response.choices[0].message.content,
        usage: response.usage,
      });
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw new HTTPException(500, { message: "Error generating text" });
    }
  },
);

app.get("/report/:evaluationId", async (c) => {
  const db = createDbConnection(c.env.DATABASE_URL);
  const evaluationId = Number(c.req.param("evaluationId"));

  const evaluation = await db
    .select()
    .from(evaluations)
    .where(eq(evaluations.id, evaluationId))
    .limit(1);

  if (evaluation.length === 0) {
    throw new HTTPException(404, { message: "Evaluation not found" });
  }

  const report = await db
    .select()
    .from(reports)
    .where(eq(reports.evaluationId, evaluationId))
    .limit(1);

  if (report.length === 0) {
    throw new HTTPException(404, { message: "Report not found" });
  }

  return c.json(report[0]);
});

app.get("/models", async (c) => {
  const db = createDbConnection(c.env.DATABASE_URL);
  const allModels = await db.select().from(models);
  return c.json(allModels);
});

app.get("/evaluations", async (c) => {
  const db = createDbConnection(c.env.DATABASE_URL);
  const allEvaluations = await db.select().from(evaluations);
  return c.json(allEvaluations);
});

app.get("/reports", async (c) => {
  const db = createDbConnection(c.env.DATABASE_URL);
  const allReports = await db.select().from(reports);
  return c.json(allReports);
});

export default app;
