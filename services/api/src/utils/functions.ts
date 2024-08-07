import { neon } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import OpenAI from "openai";


export const createDbConnection = (databaseUrl: string): NeonHttpDatabase => {
    const sql = neon(databaseUrl);
    return drizzle(sql);
};

export const createOpenAIClient = (apiKey: string): OpenAI => {
    return new OpenAI({ apiKey });
};

export const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
    const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
};

export const getEmbedding = async (
    text: string,
    openai: OpenAI,
): Promise<number[]> => {
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
    });
    return response.data[0].embedding;
};