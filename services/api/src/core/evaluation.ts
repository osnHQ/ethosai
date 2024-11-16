import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { jsPDF } from "jspdf";
import { createDbConnection, createOpenAIClient } from "../utils/functions";
import { evaluateQuestionBatch } from "./process";
import { parseCSV } from "../utils/functions";
import { generateReportsBatch } from "../utils/openai";
import { configs, evaluations, models } from "../db/schema";
import { sql } from 'drizzle-orm';
import { eq } from 'drizzle-orm';

export type Env = {
  DATABASE_URL: string;
  NODE_ENV: string;
  OPENAI_API_KEY: string;
  GEMINI_API_KEY: string;
};

const evaluationRouter = new Hono<{ Bindings: Env }>();

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

evaluationRouter.post('/evaluatePdf',
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
      const csvData = [];

      for (let i = 0; i < evaluationResults.length; i++) {
        const result = evaluationResults[i];
        const report = reports[i];
        const choice = report.choice;
        const score = choiceToScore[choice] || 0;

        totalScore += score;

        const newEvaluation = await db.insert(evaluations).values({
          model,
          question: result.question,
          answer: result.answer,
          output: result.generated,
          choice,
          score: String(score),
          createdAt: new Date(),
        }).returning();

        csvData.push({
          ...result,
          choice,
          score,
          evaluationId: newEvaluation[0].id,
        });
      }

      const averageScore = totalScore / evaluationResults.length;

      await db.update(configs)
        .set({
          averageScore: averageScore.toFixed(4),
          model,
        })
        .where(sql`${configs.id} = ${sql.raw(configId.toString())}`);

      const doc = new jsPDF("p", "pt", "a4");
      const margin = 50;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const lineHeight = 14;
      const contentWidth = pageWidth - 2 * margin;
      let yPos = margin;

      const primaryColor = [0, 32, 96];
      const accentColor = [128, 128, 128];

      doc.setFont("Times", "Roman");

      const addDivider = () => {
        doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.setLineWidth(0.5);
        yPos += 10;
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 15;
      };

      const addHeader = (title: string, pageNum: number) => {
        yPos = margin;
        doc.setFont("Helvetica", "Bold");
        doc.setFontSize(18);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(title, margin, yPos);
        yPos += 20;
        addDivider();
        doc.setFont("Times", "Italic");
        doc.setFontSize(10);
        doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - margin / 2, { align: "center" });
      };

      const addSectionHeader = (text: string) => {
        doc.setFont("Helvetica", "Bold");
        doc.setFontSize(14);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(text, margin, yPos);
        yPos += 20;
      };

      const addSubtitle = (text: string) => {
        doc.setFont("Helvetica", "Italic");
        doc.setFontSize(12);
        doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.text(text, margin, yPos);
        yPos += 18;
      };

      const addBodyText = (text: string) => {
        doc.setFontSize(11);
        doc.setFont("Times", "Roman");
        doc.setTextColor(0);
        const lines = doc.splitTextToSize(text, contentWidth);
        doc.text(lines, margin, yPos);
        yPos += lines.length * (lineHeight + 2);
      };

      const addBulletPoint = (text: string) => {
        doc.setFontSize(11);
        doc.setFont("Times", "Roman");
        doc.setTextColor(0);
        const bullet = '\u2022';
        const lines = doc.splitTextToSize(text, contentWidth - 15);
        doc.text(bullet, margin, yPos);
        doc.text(lines, margin + 15, yPos);
        yPos += lines.length * (lineHeight + 2);
      };

      const addTable = (data: string[][], colWidths: number[]) => {
        const rowHeight = 20;
        data.forEach((row, rowIndex) => {
          row.forEach((cell, colIndex) => {
            const x = margin + colWidths.slice(0, colIndex).reduce((a, b) => a + b, 0);
            if (rowIndex === 0) {
              doc.setFont("Helvetica", "Bold");
              doc.setFontSize(11);
              doc.setTextColor(255, 255, 255);
              doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
              doc.rect(x, yPos, colWidths[colIndex], rowHeight, "F");
              doc.text(cell, x + 5, yPos + rowHeight / 2 + 4);
            } else {
              doc.setFont("Times", "Roman");
              doc.setFontSize(10);
              doc.setTextColor(0);
              doc.setFillColor(245, 245, 245);
              doc.rect(x, yPos, colWidths[colIndex], rowHeight, "F");
              doc.text(cell, x + 5, yPos + rowHeight / 2 + 4);
            }
          });
          yPos += rowHeight;
        });
        yPos += 10;
      };

      addHeader("LLM Audit Report", 1);
      addSectionHeader(`Testing against ${model}`);  
      yPos += 20;
      doc.setFont("Helvetica", "Bold");
      doc.setFontSize(24);
      doc.setTextColor(0, 0, 139);
      doc.text(`Average Score: ${averageScore.toFixed(2)}`, margin, yPos);
      yPos += 40; 

      addSectionHeader("Introduction");
      addBodyText("In today's rapidly evolving technological landscape, Large Language Models (LLMs) have emerged as powerful tools capable of generating human-quality text, translating languages, and answering complex questions with remarkable accuracy. As these models become increasingly integrated into various sectors, ensuring their responsible development and deployment is paramount. At ethosAI, we are committed to providing transparent and accountable AI evaluation through our advanced LLM auditing engine.");
      addBodyText("Our engine is built on an in-house LLM that rigorously assesses AI models across three core principles: Holistic Assessment, Dynamic Benchmarking, and Ethical Foundations. This approach allows us to evaluate not only an LLM's factual knowledge and recall but also its logical reasoning, creative abilities, and ethical decision-making capabilities.");
      addSubtitle("Ensuring Accuracy and Fairness");
      addBodyText("Ensuring the accuracy and fairness of LLM models is paramount. As these models become integral to key sectors such as healthcare, finance, and transportation, the risks associated with biases and inaccuracies increase significantly. Traditional methods of LLM evaluation often struggle to catch subtle biases or predict how models will perform in diverse real-world scenarios. This gap not only threatens the reliability of AI applications but also raises serious ethical concerns.");

      addSectionHeader("Case Study: US Constitution");
      addBodyText("The audit process involves a systematic methodology to evaluate the performance of LLMs in answering factual questions related to the Constitution of the United States of America.");

      doc.addPage();
      addHeader("LLM Audit Report", 2);
      addSectionHeader("The Audit Process");
      addBodyText("Our audit process includes the following steps:");
      addBulletPoint("Generation of Evaluation Files: We meticulously crafted a set of questions and corresponding ideal answers based on the chosen topic, covering a wide range of complexities and subtopics.");
      addBulletPoint("Selection of LLMs: Representative LLMs, in this case, GPT-4o and GPT-4o mini, were selected for evaluation.");
      addBulletPoint("Running the Evaluation: We utilized the ethosAI engine to facilitate the interaction between the questions and the selected LLMs, recording the responses for subsequent analysis.");
      addBulletPoint("Analysis and Results: We carefully analyzed the LLM responses, comparing them against the pre-defined ideal answers to evaluate their accuracy, relevance, and completeness.");

      addSectionHeader("Scoring Methodology");
      addBodyText("To ensure objective and comprehensive scoring, we employed a distance-based scoring methodology. A second LLM was used to calculate the distance between the ideal answers and the actual outputs generated by GPT-4o and GPT-4o mini.");

      const scoringTableData = [
          ["Choice", "Score", "Description"],
          ["A", "0.4", "The submitted answer is a subset of the expert answer and is fully consistent with it."],
          ["B", "0.6", "The submitted answer is a superset of the expert answer and is fully consistent with it."],
          ["C", "1", "The submitted answer contains all the same details as the expert answer."],
          ["D", "0", "There is a disagreement between the submitted answer and the expert answer."],
          ["E", "1", "The answers differ, but these differences don't matter from the perspective of factuality."]
      ];
      addTable(scoringTableData, [60, 60, contentWidth - 130]);

      doc.addPage();
      addHeader("LLM Audit Report", 3);
      addSectionHeader("Results & Findings");
      addBodyText("Based on these scores, we measured two key performance indicators:");
      addBulletPoint("Accuracy: Defined as the percentage of times a score of 'C' or 'E' (i.e., a perfect score of 1) was achieved.");
      addBulletPoint("Average Score: Calculated as the mean of all scores obtained across the questions.");

      const resultTableData = [
        ["Category", "Accuracy (%)", "Average Score"],
        ["Presidency", "75%", "0.875"],
        ["Amendments", "71%", "0.858"],
        ["Congress", "67%", "0.867"],
        ["Federalism", "60%", "0.8"],
        ["General", "53%", "0.791"],
        ["Supreme Court", "50%", "0.8"],
        ["Rights & Liberty", "0%", "0.6"]
      ];
      addTable(resultTableData, [200, 100, 100]);
      
      yPos += 20; 
      
      addSectionHeader("Detailed Evaluation Results");
      const detailedTableData = [
        ["Question", "Expected Answer", "Choice", "Score", "Evaluation ID"],
        ...csvData.map(result => [
          result.question,
          result.answer,
          result.choice,
          result.score.toString(),
          result.evaluationId.toString(),
        ])
      ];
      addTable(detailedTableData, [150, 150, 50, 50, 60]);

      doc.addPage();
      addHeader("LLM Audit Report", 4);
      addSectionHeader("Conclusion");
      addBodyText("This audit provides a comprehensive evaluation of GPT-4o and GPT-4o mini's capabilities in answering questions related to the U.S. Constitution.");

      addSectionHeader("Recommendations");
      addBulletPoint("Fine-tuning on Specific Domains: Further training on legal terminology and concepts related to the Constitution could enhance the models' performance.");
      addBulletPoint("Addressing Bias and Ensuring Neutrality: It's crucial to ensure that the models' responses are unbiased and reflect the neutrality of the Constitution.");
      addBulletPoint("Enhancing Explainability: The models should be able to provide clear and concise explanations for their answers.");

      yPos = pageHeight - margin - 30;
      doc.setFontSize(10);
      doc.setFont("Times", "Italic");
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.text("https://ethosai.one/", margin, yPos);
      doc.text("founders@ethosai.one", pageWidth - margin, yPos, { align: "right" });

      const pdfBlob = new Blob([doc.output('arraybuffer')], { type: 'application/pdf' });

      c.header('Content-Type', 'application/pdf');
      c.header('Content-Disposition', `attachment; filename=config_${configId}_report.pdf`);

      return c.body(await pdfBlob.arrayBuffer());

    } catch (error) {
      console.error("Error evaluating PDF:", error);
      return new HTTPException(500, { message: "Batch evaluation failed" }).getResponse();
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
        return sum + parseFloat(config.averageScore || '0'); 
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