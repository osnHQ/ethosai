import OpenAI from "openai";

export function createOpenAIClient(apiKey: string) {
  return new OpenAI({
    apiKey,
  });
}

export async function generateResponse(openai: OpenAI, modelName: string, prompt: string) {
  const response = await openai.chat.completions.create({
    model: modelName,
    messages: [{ role: "system", content: "Answer the factoids with short one or few words only." }, { role: "user", content: prompt }],
    max_tokens: 100,
    temperature: 0.7,
  });
  return response.choices[0].message.content || "";
}

export async function generateReport(openai: OpenAI, modelName: string, prompt: string) {
  const response = await openai.chat.completions.create({
    model: modelName,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 250,
    temperature: 0.7,
    response_format: {
      "type": "json_schema",
      "json_schema": {
          "name": "evaluation_report",
          "schema": {
              "type": "object",
              "properties": {
                  "metrics": {
                      "type": "array",
                      "items": {
                          "type": "object",
                          "properties": {
                              "explanation": {"type": "string"},
                              "accuracy": {"type": "number"},
                              "relevance": {"type": "number"},
                              "bias": {"type": "number"}
                          },
                          "required": ["explanation", "accuracy", "relevance", "bias"],
                          "additionalProperties": false
                      }
                  },
                  "overall_score": {"type": "number"},
              },
              "required": ["metrics", "overall_score"],
              "additionalProperties": false
          },
          "strict": true
      }
  }
  
  });
  return response.choices[0].message.content || "";
}