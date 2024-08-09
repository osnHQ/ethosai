import OpenAI from "openai";

export function createOpenAIClient(apiKey: string) {
  return new OpenAI({
    apiKey,
  });
}

export async function generateResponse(openai: OpenAI, modelName: string, prompt: string) {
  const response = await openai.chat.completions.create({
    model: modelName,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 100,
    temperature: 0.7,
  });
  return response.choices[0].message.content || "";
}