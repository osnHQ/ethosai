import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { createDbConnection, createOpenAIClient } from "../utils/functions";
import { evaluateQuestion } from "./process";
import { parseCSV } from "../utils/functions";
import { getRecordsWithIds } from "../utils/db";
import { generateReport } from "../utils/openai";
import { configs } from "../db/schema";
import { sql } from 'drizzle-orm';

export type Env = {
  DATABASE_URL: string;
  NODE_ENV: string;
  OPENAI_API_KEY: string;
  GEMINI_API_KEY: string;
};

const evaluationRouter = new Hono<{ Bindings: Env }>();

const getPrompt = (context: string, question: string, answer: string, response: string) => {
  return `You are comparing a submitted answer to an expert answer on a given question. Here is the data:
  [BEGIN DATA]
  [Context]: ${context}
  [Question]: ${question}
  [Expert]: ${answer}
  [Submission]: ${response}
  [END DATA]

  Compare the factual content of the submitted answer with the expert answer. Ignore any differences in style, grammar, or punctuation.
  The submitted answer may either be a subset or superset of the expert answer, or it may conflict with it. Determine which case applies. Answer the question by selecting one of the following options:
  (A) The submitted answer is a subset of the expert answer and is fully consistent with it.
  (B) The submitted answer is a superset of the expert answer and is fully consistent with it.
  (C) The submitted answer contains all the same details as the expert answer.
  (D) There is a disagreement between the submitted answer and the expert answer.
  (E) The answers differ, but these differences don't matter from the perspective of factuality.
choice_scores:
  "A": 0.4
  "B": 0.6
  "C": 1
  "D": 0
  "E": 1

  return the answer as a json object with the following structure:
  {{
    "choice": <string>,
    "score": <float>
  }}
`;;
}

evaluationRouter.get(
  "/evaluate",
  zValidator(
    "query",
    z.object({
      context: z.string(),
      question: z.string(),
      answer: z.string(),
      model: z.string(),
    }),
  ),
  async (c) => {
    const db = createDbConnection(c.env.DATABASE_URL);
    const openai = createOpenAIClient(c.env.OPENAI_API_KEY);

    const { context, question, answer, model } = c.req.valid("query");

    try {
      const result = await evaluateQuestion(db, openai, model, { content: question, answer });

      const response = result.generated;

      const prompt = getPrompt(context, question, answer, response);

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
      context: z.string(),
      question: z.string(),
      answer: z.string(),
      model: z.string(),
    }),
  ),
  async (c) => {
    const db = createDbConnection(c.env.DATABASE_URL);
    const openai = createOpenAIClient(c.env.OPENAI_API_KEY);

    const { context, question, answer, model } = c.req.valid("json");

    try {
      const result = await evaluateQuestion(db, openai, model, { content: question, answer });
      const response = result.generated;
      const prompt = getPrompt(context, question, answer, response);
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

// Backend code
evaluationRouter.post('/evaluateCsv',
  zValidator('json', z.object({
    configId: z.number(),
    model: z.string(),
  })),
  async (c) => {
    const db = createDbConnection(c.env.DATABASE_URL);
    const openai = createOpenAIClient(c.env.OPENAI_API_KEY);

    const { configId, model } = c.req.valid('json');

    try {
      // Retrieve configuration from database
      const result = await db
        .select()
        .from(configs)
        .where(sql`${configs.id} = ${configId}`)
        .limit(1);

      const config = result[0];
      if (!config) {
        return c.json({ error: 'Configuration not found' }, 404);
      }

      // Parse CSV content
      const content = config.fileContents;
      const rawRecords = parseCSV(content);

      // Evaluate records
      const results = [];
      for (let i = 0; i < rawRecords.length; i++) {
        try {
          const record = {
            content: rawRecords[i]['content'],
            answer: rawRecords[i]['answer'],
          };

          if (!record.content || !record.answer) {
            console.warn(`Missing fields at row ${i + 1}:`, record);
            continue; // Skip this record
          }

          console.log(`Processing record ${i + 1}:`, record);
          const recordWithId = await getRecordsWithIds(db, [record]);
          const result = await evaluateQuestion(db, openai, model, recordWithId[0]);
          results.push(result);

        } catch (error) {
          const err = error as Error;
          console.error(`Error processing record at row ${i + 1}:`, err.message);
          results.push({ error: `Failed to evaluate record at row ${i + 1}` });
        }
      }

      // Generate CSV content
      const csvContent = generateCSV(results);

      // Set headers for CSV download with dynamic filename
      c.header('Content-Type', 'text/csv');
      c.header('Content-Disposition', `attachment; filename=config_${configId}_results.csv`); // Dynamic filename
      console.log(`Content-Disposition set to: attachment; filename=config_${configId}_results.csv`); // Log for debugging

      // Return CSV content
      return c.body(csvContent);

    } catch (error) {
      console.error("Error evaluating CSV:", error);
      return new HTTPException(500, { message: "Batch CSV evaluation failed" }).getResponse();
    }
  }
);



function generateCSV(results: any[]): string {
  const headers = ['question', 'answer', 'generated', 'similarity', 'evaluationId'];
  let csvContent = headers.join(',') + '\n';

  for (const result of results) {
    const row = headers.map(header => {
      let cell = result[header] || '';
      // Escape quotes and wrap in quotes if the cell contains a comma
      if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))) {
        cell = `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    });
    csvContent += row.join(',') + '\n';
  }

  return csvContent;
}

export default evaluationRouter;
