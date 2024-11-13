import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import OpenAI from "openai";
import { generateResponse, generateReport } from "../utils/openai"; // Ensure these functions are exported correctly
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

export async function evaluateQuestionBatch(
  db: NeonHttpDatabase,
  openai: OpenAI,
  model: string,
  questions: { content: string; answer: string }[]
): Promise<{ question: string; answer: string; generated: string }[]> {
  const results = await Promise.all(
    questions.map(async (question) => {
      const result = await openai.chat.completions.create({
        model: model,
        messages: [{ role: "user", content: question.content }],
        max_tokens: 150,
      });
      
      const generatedText = result.choices[0]?.message?.content?.trim() || ""; // Ensures fallback to an empty string if content is null or undefined

      return {
        question: question.content,
        answer: question.answer,
        generated: generatedText
      };
    })
  );
  return results;
}
