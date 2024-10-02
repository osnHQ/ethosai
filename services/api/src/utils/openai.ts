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
    temperature: 0,
  });
  return response.choices[0].message.content || "";
}

export async function generateReport(openai: OpenAI, modelName: string, prompt: string) {
  const response = await openai.chat.completions.create({
    model: modelName,
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
    response_format: {
      "type": "json_schema",
        "json_schema": {
            "name": "choice-scoring",
            "strict": true,
            "schema": {
                "type": "object",
                "properties": {
                    "choice": {"type": "string"},
                    "score": {"type": "number"},
                },
                "required": [
                    "choice",
                    "score",
                ],
                "additionalProperties": false,
            },
        },
  }
  
  });
  return response.choices[0].message.content || "";
}