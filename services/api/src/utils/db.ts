import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { models, questions } from "../db/schema";
import { eq } from "drizzle-orm";

export async function getModelByName(db: NeonHttpDatabase, modelName: string) {
    const model = await db.select().from(models).where(eq(models.name, modelName)).limit(1);
    if (model.length === 0) {
        throw new Error("Model not found");
    }
    return model[0];
}

export async function getQuestionById(db: NeonHttpDatabase, questionId: number) {
    const question = await db.select().from(questions).where(eq(questions.id, questionId)).limit(1);
    if (question.length === 0) {
        throw new Error("Question not found");
    }
    return question[0];
}

export async function getQuestionByContent(db: NeonHttpDatabase, content: string) {
    const question = await db.select().from(questions).where(eq(questions.content, content)).limit(1);
    if (question.length === 0) {
        throw new Error("Question not found");
    }
    return question[0];
}

export async function getRecordsWithIds(db: NeonHttpDatabase, records: { content: string, answer: string }[]) {
    const recordsWithIds = await Promise.all(records.map(async (record, index) => {
        const question = await getQuestionByContent(db, record.content);
        return {
            id: question.id,
            content: record.content,
            answer: record.answer,
        };
    }));
    return recordsWithIds;
}
