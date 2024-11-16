import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { createDbConnection, createOpenAIClient } from "../utils/functions";
import { evaluateQuestionBatch } from "./process"; // New batch evaluation function
import { parseCSV } from "../utils/functions";
import { getRecordsWithIds } from "../utils/db";
import { generateReportsBatch } from "../utils/openai"; // New batch report generation function
import { configs, evaluations,models } from "../db/schema";
import { sql } from 'drizzle-orm';
import { eq } from 'drizzle-orm';  


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

      let totalScore = 0;

      for (let i = 0; i < evaluationResults.length; i++) {
        const result = evaluationResults[i];
        const report = reports[i];
        const choice = report.choice;
        const score = choiceToScore[choice] || 0;

        totalScore += score;

        await db.insert(evaluations).values({
          model,
          question: result.question,
          answer: result.answer,
          output: result.generated,
          choice,
          score: String(score),
          createdAt: new Date(),
        });
      }

const averageScore = totalScore / evaluationResults.length;

await db.update(configs)
  .set({
    averageScore: averageScore.toFixed(4), 
    model, 
  })
  .where(sql`${configs.id} = ${sql.raw(configId.toString())}`);





      const csvContent = generateCSV(evaluationResults.map((result, index) => ({
        ...result,
        choice: reports[index].choice,
        score: choiceToScore[reports[index].choice] || 0,
      })));

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


evaluationRouter.post('/ModelAverageScores', async (c) => {
  const db = createDbConnection(c.env.DATABASE_URL);

  try {
    const allModels = await db.select({ name: models.name }).from(models);

    for (const { name: modelName } of allModels) {
      const configsForModel = await db
        .select()
        .from(configs)
        .where(eq(configs.model, modelName));

      if (configsForModel.length === 0) {
        console.warn(`No configs found for model ${modelName}`);
        continue;
      }

      const totalScore = configsForModel.reduce((sum, config) => {
        return sum + parseFloat(config.averageScore || '0'); // Convert score to float
      }, 0);

      const avgScore = totalScore / configsForModel.length;


      const existingModel = await db
        .select()
        .from(models)
        .where(eq(models.name, modelName))
        .limit(1);

      if (existingModel.length > 0) {
        await db
          .update(models)
          .set({ averageScore: avgScore.toFixed(4) }) 
          .where(eq(models.name, modelName));
      } else {
        await db
          .insert(models)
          .values({
            name: modelName,
            averageScore: avgScore.toFixed(4), 
          });
      }
    }

    return c.json({ message: 'Updated average scores for all models' });
  } catch (error) {
    console.error("Error updating all model average scores:", error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default evaluationRouter;
