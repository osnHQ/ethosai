import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import OpenAI from "openai";
import { generateResponse, generateReport } from "../utils/openai";
import { evaluations } from "../db/schema";

interface Question {
  content: string;
  answer: string;
}

interface EvaluationResult {
  question: string;
  answer: string;
  generated: string;
  choice?: string;
  score?: number;
  evaluationId?: string;
}

export async function evaluateQuestion(
  db: NeonHttpDatabase,
  openai: OpenAI,
  model: string,
  question: Question,
): Promise<EvaluationResult> {
  try {
    const generatedResponse = await generateResponse(
      openai,
      model,
      question.content,
    );
    const report = await generateReport(openai, model, generatedResponse);
    const { choice, score } = report;

    const [newEvaluation] = await db
      .insert(evaluations)
      .values({
        model,
        question: question.content,
        answer: question.answer,
        output: generatedResponse,
        choice,
        score: String(score),
        createdAt: new Date(),
      })
      .returning();

    return {
      question: question.content,
      answer: question.answer,
      generated: generatedResponse,
      choice,
      score,
      evaluationId: String(newEvaluation.id),
    };
  } catch (error) {
    console.error("Error evaluating question:", error);
    throw error;
  }
}

export async function evaluateQuestionBatch(
  db: NeonHttpDatabase,
  openai: OpenAI,
  model: string,
  questions: Question[],
): Promise<EvaluationResult[]> {
  try {
    const results = await Promise.all(
      questions.map(async (question) => {
        const result = await openai.chat.completions.create({
          model,
          messages: [{ role: "user", content: question.content }],
          max_tokens: 150,
        });

        const generatedText = result.choices[0]?.message?.content?.trim() ?? "";

        return {
          question: question.content,
          answer: question.answer,
          generated: generatedText,
        };
      }),
    );
    return results;
  } catch (error) {
    console.error("Error evaluating question batch:", error);
    throw error;
  }
}
