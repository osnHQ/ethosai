import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { models, configs } from "../db/schema";
import { eq } from "drizzle-orm";

type Config = {
    id: number;
    name: string;
    category: string;
    tags: string[];
    reviewStatus: string;
    dateSubmitted: Date;
    lastReviewed: Date;
    submittedBy: Date;
}

export async function createConfig(db: NeonHttpDatabase, config: Config) {
    await db.insert(configs).values({
        name: config.name,
        category: config.category,
        tags: config.tags,
        reviewStatus: config.reviewStatus,
        dateSubmitted: config.dateSubmitted,
        lastReviewed: config.lastReviewed,
        submittedBy: config.submittedBy,
    });
}

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

export async function getConfigById(db: NeonHttpDatabase, id: number) {
    const config = await db.select().from(configs).where(eq(configs.id, id)).limit(1);
    if (config.length === 0) {
        throw new Error("Config not found");
    }
    return config[0];
}

export async function getConfigs(db: NeonHttpDatabase) {
    return db.select().from(configs);
}