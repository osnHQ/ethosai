import OpenAI from "openai";

export const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
    const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return Math.round(dotProduct / (magnitudeA * magnitudeB) * 100) / 100;
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