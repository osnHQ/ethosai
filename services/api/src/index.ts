import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { neon } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import { models, evaluations, results } from "./db/schema";
import { eq } from "drizzle-orm";
import OpenAI from "openai";

export type Env = {
  DATABASE_URL: string;
  NODE_ENV: string;
  OPENAI_API_KEY: string;
};

enum ModelType {
  GPT_3_5_TURBO = "gpt-3.5-turbo",
  GPT_4O_MINI = "gpt-4o-mini",
}

const createDbConnection = (databaseUrl: string): NeonHttpDatabase => {
  const sql = neon(databaseUrl);
  return drizzle(sql);
};

const createOpenAIClient = (apiKey: string): OpenAI => {
  return new OpenAI({ apiKey });
};

const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

const getEmbedding = async (
  text: string,
  openai: OpenAI,
): Promise<number[]> => {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
};

const app = new Hono<{ Bindings: Env }>();

app.onError((err: Error, c) => {
  console.error(`${err}`);
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return c.json({ error: "Internal Server Error" }, 500);
});

app.get("/", (c) => c.json({ message: "Welcome to EthosAI API!" }));

app.post(
  "/evaluate",
  zValidator(
    "json",
    z.object({
      question: z.string(),
      answer: z.string(),
      model: z.nativeEnum(ModelType),
    }),
  ),
  async (c) => {
    const openai = createOpenAIClient(c.env.OPENAI_API_KEY);
    const { question, answer, model } = c.req.valid("json");

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
        modelId: model,
        name: `Evaluation for question: ${question}`,
        evaluator: "EthosAI API User",
      })
      .returning();

    await db.insert(results).values({
      evaluationId: newEvaluation[0].id,
      score: similarity.toString(),
      metadata: { question, answer, generatedResponse },
    });

    return c.json({
      question,
      answer,
      generated: generatedResponse,
      similarity,
      evaluationId: newEvaluation[0].id,
    });
  },
);

app.get("/models", async (c) => {
  const db = createDbConnection(c.env.DATABASE_URL);
  const allModels = await db.select().from(models);
  return c.json(allModels);
});

app.get("/models/:id", async (c) => {
  const db = createDbConnection(c.env.DATABASE_URL);
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    throw new HTTPException(400, { message: "Invalid ID" });
  }
  const model = await db
    .select()
    .from(models)
    .where(eq(models.id, id))
    .limit(1);
  if (model.length === 0) {
    throw new HTTPException(404, { message: "Model not found" });
  }
  return c.json(model[0]);
});

app.post(
  "/models",
  zValidator(
    "json",
    z.object({
      name: z.string(),
      description: z.string().optional(),
    }),
  ),
  async (c) => {
    const db = createDbConnection(c.env.DATABASE_URL);
    const body = c.req.valid("json");
    const newModel = await db.insert(models).values(body).returning();
    return c.json(newModel[0], 201);
  },
);

app.get("/evaluations", async (c) => {
  const db = createDbConnection(c.env.DATABASE_URL);
  const allEvaluations = await db.select().from(evaluations);
  return c.json(allEvaluations);
});

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

app.get("/results", async (c) => {
  const db = createDbConnection(c.env.DATABASE_URL);
  const allResults = await db.select().from(results);
  return c.json(allResults);
});

app.get("/results/:id", async (c) => {
  const db = createDbConnection(c.env.DATABASE_URL);
  const id = Number(c.req.param("id"));
  const result = await db
    .select()
    .from(results)
    .where(eq(results.id, id))
    .limit(1);
  if (result.length === 0) {
    throw new HTTPException(404, { message: "Result not found" });
  }
  return c.json(result[0]);
});

app.post(
  "/results",
  zValidator(
    "json",
    z.object({
      evaluationId: z.number(),
      score: z.number(),
      metadata: z.record(z.unknown()).optional(),
    }),
  ),
  async (c) => {
    const db = createDbConnection(c.env.DATABASE_URL);
    const body = c.req.valid("json");

    const resultData = {
      evaluationId: body.evaluationId,
      score: String(body.score),
      metadata: body.metadata,
    };

    const newResult = await db.insert(results).values(resultData).returning();
    return c.json(newResult[0], 201);
  },
);

app.post(
  "/generate-text",
  zValidator(
    "json",
    z.object({
      prompt: z.string(),
      model: z.nativeEnum(ModelType),
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

  const result = await db
    .select()
    .from(results)
    .where(eq(results.evaluationId, evaluationId))
    .limit(1);

  if (result.length === 0) {
    throw new HTTPException(404, { message: "Result not found" });
  }

  return c.json(result[0]);
});

export default app;
