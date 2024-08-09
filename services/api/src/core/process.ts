import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import OpenAI from "openai";
import { generateResponse } from "../utils/openai";
import { getEmbedding, cosineSimilarity } from "../utils/embedding";
import { evaluations, questions } from "../db/schema";

export async function evaluateQuestion(
  db: NeonHttpDatabase,
  openai: OpenAI,
  model: string,
  question: { id: number, content: string, answer: string }
) {

  const generatedResponse = await generateResponse(openai, model, question.content);

  const [answerEmbedding, generatedEmbedding] = await Promise.all([
    getEmbedding(question.answer, openai),
    getEmbedding(generatedResponse, openai),
  ]);

  const similarity = cosineSimilarity(answerEmbedding, generatedEmbedding);

  const newEvaluation = await db
    .insert(evaluations)
    .values({
      model: model,
      questionId: question.id,
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

export async function upsertQuestions(db: NeonHttpDatabase, records: { content: string, answer: string }[]) {
  await Promise.all(records.map(async (record, index) => {
    await db
      .insert(questions)
      .values({
        id: index + 1,
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
