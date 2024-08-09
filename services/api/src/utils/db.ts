import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { models } from "../db/schema";
import { eq } from "drizzle-orm";

export async function getModelByName(db: NeonHttpDatabase, modelName: string) {
    const model = await db.select().from(models).where(eq(models.name, modelName)).limit(1);
    if (model.length === 0) {
        throw new Error("Model not found");
    }
    return model[0];
}

export async function getRecordsWithIds(db: NeonHttpDatabase, records: { content: string, answer: string }[]) {
    const recordsWithIds = await Promise.all(records.map(async (record, index) => {
        return {
            id: index + 1,
            content: record.content,
            answer: record.answer,
        };
    }));
    return recordsWithIds;
}
