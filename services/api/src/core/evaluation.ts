import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { createDbConnection, createOpenAIClient } from "../utils/functions";
import { evaluateQuestionBatch } from "./process"; // New batch evaluation function
import { parseCSV } from "../utils/functions";
import { getRecordsWithIds } from "../utils/db";
import { generateReportsBatch } from "../utils/openai"; // New batch report generation function
import { configs } from "../db/schema";
import { sql } from 'drizzle-orm';


export type Env = {
  DATABASE_URL: string;
  NODE_ENV: string;
  OPENAI_API_KEY: string;
  GEMINI_API_KEY: string;
};

const evaluationRouter = new Hono<{ Bindings: Env }>();

// Mapping the choice letter to the corresponding score
const choiceToScore: Record<string, number> = {
  A: 0.4,
  B: 0.6,
  C: 1,
  D: 0,
  E: 1,
};

const getPromptForModel = (model: string, context: string, question: string, answer: string, response: string): string => {
  if (model === 'gpt-4o') {
    return `You are tasked with evaluating the factual content of a submitted answer against an expert answer. For each evaluation, return a JSON object. Here is the data:
[Context]: ${context}
[Question]: ${question}
[Expert Answer]: ${answer}
[Submitted Answer]: ${response}

Based on the comparison, select one of the following options:
(A) The submitted answer is a subset of the expert answer and is fully consistent with it.
(B) The submitted answer is a superset of the expert answer and is fully consistent with it.
(C) The submitted answer contains all the same details as the expert answer.
(D) There is a disagreement between the submitted answer and the expert answer.
(E) The answers differ, but these differences don't matter from the perspective of factuality.

Return the result as a JSON object with the following format:
{
  "choice": "<string>",
  "score": <float>
}
Ensure the response is only this JSON object for each question-answer pair.`;
  }

  // Default or gpt-4o-mini prompt
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

Please return the answer strictly as a JSON object with the following structure, and ensure the choice is a single letter:
{
  "choice": "<string>",
  "score": <float>
}
Only include this JSON object in your response.`;
};

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
      const [config] = await db
        .select()
        .from(configs)
        .where(sql`${configs.id} = ${configId}`)
        .limit(1);

      if (!config) {
        return c.json({ error: 'Configuration not found' }, 404);
      }

      const content = config.fileContents;
      const rawRecords = parseCSV(content);

      const validRecords = rawRecords
        .map((record, index) => {
          if (typeof record.content === "string" && typeof record.answer === "string") {
            return { content: record.content, answer: record.answer };
          } else {
            console.warn(`Skipping row ${index + 1} due to missing fields`);
            return null;
          }
        })
        .filter(Boolean) as { content: string; answer: string }[];

      const evaluationResults = await evaluateQuestionBatch(db, openai, model, validRecords);

      const prompts = evaluationResults.map((result) =>
        getPromptForModel(model, "", result.question, result.answer, result.generated)
      );

      const reports = await generateReportsBatch(openai, model, prompts);

      // Map the reports to the results, calculating the score based on the choice letter
      const results = evaluationResults.map((result, index) => {
        const choice = reports[index].choice;
        const score = choiceToScore[choice] || 0; // Default to 0 if choice is not found
        return {
          ...result,
          choice,
          score,
        };
      });

      const csvContent = generateCSV(results);

      c.header('Content-Type', 'text/csv');
      c.header('Content-Disposition', `attachment; filename=config_${configId}_results.csv`);

      return c.body(csvContent);

    } catch (error) {
      console.error("Error evaluating CSV:", error);
      return new HTTPException(500, { message: "Batch CSV evaluation failed" }).getResponse();
    }
  }
);

function generateCSV(results: any[]): string {
  const headers = ['question', 'answer', 'generated', 'choice', 'score', 'evaluationId'];
  let csvContent = headers.join(',') + '\n';

  for (const result of results) {
    const row = headers.map(header => {
      let cell = result[header] || '';
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
