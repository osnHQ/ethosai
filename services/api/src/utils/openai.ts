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

    return response.choices[0]?.message?.content || ""; 
  } catch (error) {
    console.error("Error generating response:", error);
    return "";
  }
}

export async function generateReport(
  openai: OpenAI,
  modelName: string,
  prompt: string
): Promise<ReportResponse> {
  try {
    const response = await openai.chat.completions.create({
      model: modelName,
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    const messageContent = response.choices[0]?.message?.content ?? "{}";

    if (!messageContent.trim().startsWith("{") || !messageContent.trim().endsWith("}")) {
      return { choice: "", score: 0 };
    }

    try {
      const parsedResponse: Partial<ReportResponse> = JSON.parse(messageContent);

      if (typeof parsedResponse.choice === 'string' && typeof parsedResponse.score === 'number') {
        return {
          choice: parsedResponse.choice.trim().charAt(0), 
          score: parsedResponse.score,
        };
      } else {
        console.error("Invalid structure for report response:", parsedResponse);
        return { choice: "", score: 0 };
      }
    } catch (parseError) {
      console.error("Failed to parse report JSON response:", parseError);
      console.error("Original message content:", messageContent);
      return { choice: "", score: 0 };
    }
  } catch (error) {
    console.error("Error generating report:", error);
    return { choice: "", score: 0 };
  }
}

export async function generateReportsBatch(
  openai: OpenAI,
  model: string,
  prompts: string[]
): Promise<ReportResponse[]> {
  const results = await Promise.all(
    prompts.map(async (prompt) => {
      const response = await openai.chat.completions.create({
        model: model,
        messages: [{ role: "system", content: prompt }],
      });
      const content = JSON.parse(response.choices[0]?.message?.content?.trim() || "{}");
      return { choice: content.choice || "", score: content.score || 0 };
    })
  );
  return results;
}
