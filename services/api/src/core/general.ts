import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { createDbConnection, createOpenAIClient } from "../utils/functions";
import { getEmbedding } from "../utils/embedding";
import { models, evaluations, reports } from "../db/schema";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export type Env = {
    DATABASE_URL: string;
    NODE_ENV: string;
    OPENAI_API_KEY: string;
};

const generalRouter = new Hono<{ Bindings: Env }>();

generalRouter.get("/", (c) => c.json({ message: "Welcome to EthosAI API!" }));

generalRouter.get("/generateEmbedding",
    zValidator("query", z.object({ prompt: z.string() })),
    async (c) => {
        const { prompt } = c.req.valid("query");
        const embedding = await getEmbedding(prompt, createOpenAIClient(c.env.OPENAI_API_KEY));
        return c.json(embedding);
    }
);

generalRouter.get("/evaluations/:id", async (c) => {
    const db = createDbConnection(c.env.DATABASE_URL);
    const id = Number(c.req.param("id"));
    const evaluation = await db
        .select()
        .from(evaluations)
        .where(eq(evaluations.id, id))
        .limit(1);
    if (evaluation.length === 0) {
        throw new HTTPException(404, { message: "Evaluation not found" });
    }
    return c.json(evaluation[0]);
});

generalRouter.get("/reports/:id", async (c) => {
    const db = createDbConnection(c.env.DATABASE_URL);
    const id = Number(c.req.param("id"));
    const report = await db
        .select()
        .from(reports)
        .where(eq(reports.id, id))
        .limit(1);
    if (report.length === 0) {
        throw new HTTPException(404, { message: "Report not found" });
    }
    return c.json(report[0]);
});

generalRouter.get("/models", async (c) => {
    const db = createDbConnection(c.env.DATABASE_URL);
    const allModels = await db.select().from(models);
    return c.json(allModels);
});

generalRouter.get("/evaluations", async (c) => {
    const db = createDbConnection(c.env.DATABASE_URL);
    const allEvaluations = await db.select().from(evaluations);
    return c.json(allEvaluations);
});

generalRouter.get("/reports", async (c) => {
    const db = createDbConnection(c.env.DATABASE_URL);
    const allReports = await db.select().from(reports);
    return c.json(allReports);
});

export default generalRouter;
