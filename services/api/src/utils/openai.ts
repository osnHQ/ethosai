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
        { role: "system", content: "Evaluate the factual content and return a JSON object." },
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
  try {
    const response = await openai.chat.completions.create({
      model: modelName,
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    const messageContent = response.choices[0]?.message?.content?.trim() ?? "{}";

    // Ensure the response is a valid JSON format
    if (!messageContent.startsWith("{") || !messageContent.endsWith("}")) {
      console.error("Invalid JSON format:", messageContent);
      return { choice: "E", score: 0 };  // Return default values if the response is not valid
    }

    const parsedResponse: Partial<ReportResponse> = JSON.parse(messageContent);

    // Ensure valid structure for report response
    if (typeof parsedResponse.choice === 'string' && typeof parsedResponse.score === 'number') {
      return {
        choice: parsedResponse.choice.trim().charAt(0),  // Ensure that the choice is a single character
        score: parsedResponse.score,
      };
    } else {
      console.error("Invalid structure for report response:", parsedResponse);
      return { choice: "E", score: 0 };  // Default to 'E' and score 0 if structure is invalid
    }
  } catch (error) {
    console.error("Error generating report:", error);
    return { choice: "E", score: 0 };  // Return default values in case of an error
  }
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
          temperature: 0,  // Ensure consistency with the temperature setting in other functions
        });

        const content = response.choices[0]?.message?.content?.trim() || "{}";  // Fallback to empty JSON if missing
        console.log("Raw model output:", content);  // Log the raw output for debugging

        const parsedContent = JSON.parse(content);

        // Ensure that we return a valid report response
        return { choice: parsedContent.choice || "E", score: parsedContent.score || 0 };
      } catch (error) {
        console.error("Error processing batch report:", error);
        return { choice: "E", score: 0 };  // Return default values in case of an error
      }
    })
  );
  return results;
}
