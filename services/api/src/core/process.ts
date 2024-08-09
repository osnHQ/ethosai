import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import OpenAI from "openai";
import { generateResponse } from "../utils/openai";
import { getEmbedding, cosineSimilarity } from "../utils/embedding";
import { evaluations } from "../db/schema";

export async function evaluateQuestion(
  db: NeonHttpDatabase,
  openai: OpenAI,
  model: string,
  question: { content: string, answer: string }
) {

  const generatedResponse = await generateResponse(openai, model, question.content);

  const [answerEmbedding, generatedEmbedding] = await Promise.all([
    getEmbedding(question.answer.toLowerCase(), openai),
    getEmbedding(generatedResponse.toLowerCase(), openai),
  ]);

  const similarity = cosineSimilarity(answerEmbedding, generatedEmbedding);

  const newEvaluation = await db
    .insert(evaluations)
    .values({
      model: model,
      question: question.content,
      answer: question.answer,
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
