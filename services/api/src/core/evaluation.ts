import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { createDbConnection, createOpenAIClient } from "../utils/functions";
import { evaluateQuestion } from "./process";
import { parseCSV } from "../utils/functions";
import { getRecordsWithIds } from "../utils/db";
import { generateReport } from "../utils/openai";

export type Env = {
  DATABASE_URL: string;
  NODE_ENV: string;
  OPENAI_API_KEY: string;
};

const evaluationRouter = new Hono<{ Bindings: Env }>();

evaluationRouter.get(
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
    const db = createDbConnection(c.env.DATABASE_URL);
    const openai = createOpenAIClient(c.env.OPENAI_API_KEY);
    
    const { question, answer, model } = c.req.valid("query");

    try {
      const result = await evaluateQuestion(db, openai, model, { content: question, answer });

      const prompt = `question: ${question}\nanswer: ${answer}\n\ngenerated response: ${result.generated}\nsimilarity: ${result.similarity}`;
      const report = await generateReport(openai, model, prompt);

      return c.json({ ...result, ...JSON.parse(report) });
    } catch (error) {
      console.error(error);
      return new HTTPException(500, { message: "Evaluation failed" }).getResponse();
    }
  }
);

evaluationRouter.post(
  "/evaluate",
  zValidator(
    "json",
    z.object({
      question: z.string(),
      answer: z.string(),
      model: z.string(),
    }),
  ),
  async (c) => {
    const db = createDbConnection(c.env.DATABASE_URL);
    const openai = createOpenAIClient(c.env.OPENAI_API_KEY);
    
    const { question, answer, model } = c.req.valid("json");

    try {
      const result = await evaluateQuestion(db, openai, model, { content: question, answer });
      const prompt = `question: ${question}\nanswer: ${answer}\n\ngenerated response: ${result.generated}\nsimilarity: ${result.similarity}`;
      const report = await generateReport(openai, model, prompt);

      return c.json({ ...result, ...JSON.parse(report) });
    } catch (error) {
      console.error(error);
      return new HTTPException(500, { message: "Evaluation failed" }).getResponse();
    }
  }
);

evaluationRouter.post('/evaluateBatch',
  zValidator('json', z.object({
    model: z.string(),
    questions: z.array(z.object({
      content: z.string(),
      answer: z.string(),
    })),
  })),
  async (c) => {
    const db = createDbConnection(c.env.DATABASE_URL);
    const openai = createOpenAIClient(c.env.OPENAI_API_KEY);
    const { model, questions } = c.req.valid('json');

    try {
      const results = await Promise.all(
        questions.map((question) => evaluateQuestion(db, openai, model, { ...question }))
      );
      
      const prompts = results.map((result) => `question: ${result.question}\nanswer: ${result.answer}\n\ngenerated response: ${result.generated}\nsimilarity: ${result.similarity}`);
      const reports = await Promise.all(prompts.map((prompt) => generateReport(openai, model, prompt)));

      return c.json(results.map((result, index) => ({ ...result, ...JSON.parse(reports[index]) })));
    } catch (error) {
      console.error(error);
      return new HTTPException(500, { message: "Batch evaluation failed" }).getResponse();
    }
  }
);

evaluationRouter.post('/evaluateBatchCsv',
  zValidator('form', z.object({
    file: z.instanceof(File),
    model: z.string(),
  })),
  async (c) => {
    const db = createDbConnection(c.env.DATABASE_URL);
    const openai = createOpenAIClient(c.env.OPENAI_API_KEY);
    
    const { file, model } = c.req.valid('form');
    const content = await file.text();
    const rawRecords = parseCSV(content);

    const records = rawRecords.map((record: Record<string, string>) => ({
      content: record['content'],
      answer: record['answer'],
    }));

    try {
      const recordsWithIds = await getRecordsWithIds(db, records);

      const results = await Promise.all(
        recordsWithIds.map((record: { id: number; content: string; answer: string; }) => evaluateQuestion(db, openai, model, record))
      );

      return c.json(results);
    } catch (error) {
      console.error(error);
      return new HTTPException(500, { message: "Batch CSV evaluation failed" }).getResponse();
    }
  }
);

export default evaluationRouter;
