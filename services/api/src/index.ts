import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { apiReference } from '@scalar/hono-api-reference';
import { z } from "zod";
import { models, evaluations, reports, questions } from "./db/schema";
import { eq } from "drizzle-orm";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { createDbConnection, createOpenAIClient, cosineSimilarity, getEmbedding } from "./utils/functions";
import OpenAI from "openai";

export type Env = {
  DATABASE_URL: string;
  NODE_ENV: string;
  OPENAI_API_KEY: string;
};

type EvaluationResult = {
  question: string;
  answer: string;
  generated: string;
  similarity: number;
  evaluationId: number;
};

type QuestionRecord = {
  questionId: number;
  content: string;
  answer: string;
};

const app = new Hono<{ Bindings: Env }>();

app.get(
  '/reference',
  apiReference({
    spec: {
      url: '/openapi.json',
    },
  }),
);

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
  }
);

async function getModel(db: NeonHttpDatabase, modelId: number) {
  const model = await db.select().from(models).where(eq(models.id, modelId)).limit(1);
  if (model.length === 0) {
    throw new HTTPException(404, { message: "Model not found" });
  }
  return model[0];
}

async function getQuestion(db: NeonHttpDatabase, questionId: number) {
  const question = await db.select().from(questions).where(eq(questions.id, questionId)).limit(1);
  if (question.length === 0) {
    throw new HTTPException(404, { message: "Question not found" });
  }
  return question[0];
}

async function evaluateQuestion(
  db: NeonHttpDatabase,
  openai: OpenAI,
  modelId: number,
  questionId: number
): Promise<EvaluationResult> {
  const model = await getModel(db, modelId);
  const question = await getQuestion(db, questionId);

  const openaiResponse = await openai.chat.completions.create({
    model: model.name,
    messages: [{ role: "user", content: question.content }],
    max_tokens: 100,
    temperature: 0.7,
  });

  const generatedResponse = openaiResponse.choices[0].message.content || "";

  const [answerEmbedding, generatedEmbedding] = await Promise.all([
    getEmbedding(question.answer, openai),
    getEmbedding(generatedResponse, openai),
  ]);

  const similarity = cosineSimilarity(answerEmbedding, generatedEmbedding);

  const newEvaluation = await db
    .insert(evaluations)
    .values({
      modelId: modelId,
      questionId: questionId,
      output: generatedResponse,
      score: similarity,
      createdAt: new Date(),
    })
    .returning();

  return {
    question: question.content,
    answer: question.answer,
    generated: generatedResponse,
    similarity,
    evaluationId: newEvaluation[0].id,
  };
}

app.post(
  "/evaluate",
  zValidator(
    "json",
    z.object({
      questionId: z.number(),
      modelId: z.number(),
    }),
  ),
  async (c) => {
    const db = createDbConnection(c.env.DATABASE_URL);
    const openai = createOpenAIClient(c.env.OPENAI_API_KEY);
    const { questionId, modelId } = c.req.valid("json");

    const result = await evaluateQuestion(db, openai, modelId, questionId);
    return c.json(result);
  },
);

app.post('/evaluateBatch',
  zValidator('json', z.object({
    modelId: z.number(),
    questionIds: z.array(z.number()),
  })),
  async (c) => {
    const db = createDbConnection(c.env.DATABASE_URL);
    const openai = createOpenAIClient(c.env.OPENAI_API_KEY);
    const { modelId, questionIds } = c.req.valid('json');

    const results = await Promise.all(
      questionIds.map(questionId => evaluateQuestion(db, openai, modelId, questionId))
    );

    return c.json(results);
  }
);

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index]?.trim() ?? '';
      return obj;
    }, {} as Record<string, string>);
  });
}

async function upsertQuestions(db: NeonHttpDatabase, records: QuestionRecord[]) {
  await Promise.all(records.map(async (record) => {
    await db
      .insert(questions)
      .values({
        id: record.questionId,
        content: record.content,
        answer: record.answer,
      })
      .onConflictDoUpdate({
        target: questions.id,
        set: {
          content: record.content,
          answer: record.answer,
        },
      });
  }));
}

app.post('/evaluateBatchCSV',
  zValidator('form', z.object({
    file: z.instanceof(File),
    modelId: z.string(),
  })),
  async (c) => {
    const db = createDbConnection(c.env.DATABASE_URL);
    const openai = createOpenAIClient(c.env.OPENAI_API_KEY);
    
    const { file, modelId } = c.req.valid('form');
    const content = await file.text();
    const rawRecords = parseCSV(content);

    const records: QuestionRecord[] = rawRecords.map(record => ({
      questionId: record.questionId,
      content: record.content,
      answer: record.answer,
    }));

    const modelIdNumber = parseInt(modelId, 10);

    await upsertQuestions(db, records);

    const results = await Promise.all(
      records.map(record => evaluateQuestion(db, openai, modelIdNumber, record.questionId))
    );

    return c.json(results);
  }
);

app.post(
  "/generate-text",
  zValidator(
    "json",
    z.object({
      prompt: z.string(),
      modelId: z.number(),
      temperature: z.number().min(0).max(1).optional(),
    }),
  ),
  async (c) => {
    const db = createDbConnection(c.env.DATABASE_URL);
    const openai = createOpenAIClient(c.env.OPENAI_API_KEY);
    const { prompt, modelId, temperature = 0.7 } = c.req.valid("json");

    const model = await getModel(db, modelId);

    try {
      const response = await openai.chat.completions.create({
        model: model.name,
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