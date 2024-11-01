import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import OpenAI from "openai";
import { generateResponse, generateReport } from "../utils/openai"; 
import { evaluations } from "../db/schema";

export async function evaluateQuestion(
  db: NeonHttpDatabase,
  openai: OpenAI,
  model: string,
  question: { content: string; answer: string }
) {
  const generatedResponse = await generateResponse(openai, model, question.content);
  
  const report = await generateReport(openai, model, generatedResponse);
  const { choice, score } = report;

  const newEvaluation = await db
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
    evaluationId: newEvaluation[0].id,
  };
}
