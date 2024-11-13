import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { createDbConnection, createOpenAIClient } from "../utils/functions";
import { createConfig } from "../utils/db";
import { getEmbedding } from "../utils/embedding";
import { models, evaluations, reports, configs } from "../db/schema";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import ky from "ky";
// import { experimental_createProviderRegistry as createProviderRegistry } from 'ai';
import { generateText } from "ai";
import { google, createGoogleGenerativeAI } from "@ai-sdk/google";
import { openai, createOpenAI } from "@ai-sdk/openai";
import { Context } from "hono";

export type Env = {
  DATABASE_URL: string;
  NODE_ENV: string;
  OPENAI_API_KEY: string;
  GEMINI_API_KEY: string;
};

const generalRouter = new Hono<{ Bindings: Env }>();

generalRouter.get("/", (c) => c.json({ message: "Welcome to EthosAI API!" }));

function getModel(model: string) {
  const modelMap: { [key: string]: () => any } = {
    google: () => google("models/gemini-1.5-flash-latest"),
    openai: () => openai("gpt-4o-mini"),
  };

  return modelMap[model]?.();
}

generalRouter.get("/llm", async (c) => {
  const { prompt } = c.req.query();
  const response = await ky
    .post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
      {
        searchParams: { key: c.env.GEMINI_API_KEY },
        json: { contents: [{ parts: [{ text: prompt }] }] },
        headers: { "Content-Type": "application/json" },
      },
    )
    .json();

  return c.json({ response });
});

generalRouter.get(
  "/generateEmbedding",
  zValidator("query", z.object({ prompt: z.string() })),
  async (c) => {
    const { prompt } = c.req.valid("query");
    const embedding = await getEmbedding(
      prompt,
      createOpenAIClient(c.env.OPENAI_API_KEY),
    );
    return c.json(embedding);
  },
);

generalRouter.get("/evaluations/:id", async (c) => {
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

generalRouter.get("/configs/:id", async (c) => {
  const db = createDbConnection(c.env.DATABASE_URL);
  const id = Number(c.req.param("id"));
  const config = await db
    .select()
    .from(configs)
    .where(eq(configs.id, id))
    .limit(1);
  if (config.length === 0) {
    throw new HTTPException(404, { message: "Config not found" });
  }
  return c.json(config[0]);
});

generalRouter.get("/reports/:id", async (c) => {
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

generalRouter.get("/models", async (c) => {
  const db = createDbConnection(c.env.DATABASE_URL);
  const allModels = await db.select().from(models);
  return c.json(allModels);
});

generalRouter.get("/configs", async (c) => {
  const db = createDbConnection(c.env.DATABASE_URL);
  const allConfigs = await db.select().from(configs);
  return c.json(allConfigs);
});

generalRouter.get("/configs/:id", async (c) => {
  try {
    const db = createDbConnection(c.env.DATABASE_URL);
    const configId = Number(c.req.param("id"));
    const config = await db
      .select()
      .from(configs)
      .where(eq(configs.id, configId))
      .limit(1);

    if (config.length === 0) {
      throw new HTTPException(404, { message: "Config not found" });
    }

    return c.json(config[0]);
  } catch (error) {
    console.error("Error fetching config:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

async function readFileContent(file: File): Promise<string> {
  const textContent = await file.text();
  return textContent;
}

generalRouter.post("/configs", async (c: Context) => {
  try {
    const db = createDbConnection(c.env.DATABASE_URL);
    const formData = await c.req.formData();
    const metadata = JSON.parse(formData.get("metadata") as string);
    const questionAnswerPairs = JSON.parse(
      formData.get("questionAnswerPairs") as string,
    );
    const uploadedFile = formData.get("file") as File;

    if (!metadata || !questionAnswerPairs || !uploadedFile) {
      return c.json({ error: "Missing required fields or file" }, 400);
    }

    const fileContent = await readFileContent(uploadedFile);

    const config = {
      name: metadata.name,
      category: metadata.category,
      tags: Array.isArray(metadata.tags) ? metadata.tags : [],
      reviewStatus: metadata.reviewStatus,
      dateSubmitted: new Date(metadata.dateSubmitted),
      lastReviewed: metadata.lastReviewed
        ? new Date(metadata.lastReviewed)
        : new Date(),
      submittedBy: metadata.submittedBy,
      rating: metadata.rating || 0,
      reviews: metadata.reviews || "",
      questionAnswerPairs: questionAnswerPairs,
      fileContents: fileContent,
    };

    const result = await db.insert(configs).values(config).returning({
      id: configs.id,
    });

    const configId = result[0]?.id;

    return c.json(
      { message: "Config created successfully!", id: configId },
      201,
    );
  } catch (error) {
    console.error("Error creating config:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

generalRouter.get("/evaluations", async (c) => {
  const db = createDbConnection(c.env.DATABASE_URL);
  const allEvaluations = await db.select().from(evaluations);
  const sortedEvaluations = allEvaluations.sort((a, b) => a.id - b.id);
  return c.json(sortedEvaluations);
});

generalRouter.get("/reports", async (c) => {
  const db = createDbConnection(c.env.DATABASE_URL);
  const allReports = await db.select().from(reports);
  return c.json(allReports);
});

export default generalRouter;
