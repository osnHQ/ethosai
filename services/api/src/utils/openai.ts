import OpenAI from "openai";

type ReportResponse = { choice: string; score: number };

export function createOpenAIClient(apiKey: string): OpenAI {
  return new OpenAI({ apiKey });
}

export async function generateResponse(
  openai: OpenAI,
  modelName: string,
  prompt: string
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: "system", content: "Answer the factoids with short one or few words only." },
        { role: "user", content: prompt },
      ],
      temperature: 0,
    });

    return response.choices[0]?.message?.content?.trim() || "";
  } catch (error) {
    console.error("Error generating response:", error);
    return "";  // Return an empty string in case of an error
  }
}

export async function generateReport(
  openai: OpenAI,
  modelName: string,
  prompt: string
): Promise<ReportResponse> {
  const response = await openai.chat.completions.create({
    model: modelName,
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  });

  const messageContent = response.choices[0]?.message?.content?.trim() ?? "{}";
  console.log(messageContent);
  const { choice, score } = JSON.parse(messageContent);
  console.log(choice, score);
  return { choice, score };
}

export async function generateReportsBatch(
  openai: OpenAI,
  model: string,
  prompts: string[]
): Promise<ReportResponse[]> {
  const results = await Promise.all(
    prompts.map(async (prompt) => {
      try {
        const response = await openai.chat.completions.create({
          model: model,
          messages: [{ role: "user", content: prompt }],
          response_format : {
            "type": "json_schema",
            "json_schema": {
                "name": "choice-scoring",
                "strict": true,
                "schema": {
                    "type": "object",
                    "properties": {
                        "choice": {"type": "string", 
                        "enum": ["A", "B", "C", "D", "E"]
                        },
                        "score": {"type": "number"},

                    },
                    "required": [
                        "choice",
                        "score",
                    ],
                    "additionalProperties": false,
                },
            },
        },
              });
        const content = response.choices[0]?.message?.content?.trim() || "{}";
        
        console.log("Raw model output:", content);  // Log the raw output for debugging

        const parsedContent = JSON.parse(content);
        return { choice: parsedContent.choice || "", score: parsedContent.score || 0 };
      } catch (error) {
        console.error("Error processing batch report:", error);
        return { choice: "", score: 0 };
      }
    })
  );
  return results;
}
