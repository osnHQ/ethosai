import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { createDbConnection, createOpenAIClient } from "../utils/functions";
import { getEmbedding } from "../utils/embedding";
import { models, evaluations, reports, configs } from "../db/schema";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import ky from 'ky';
// import { experimental_createProviderRegistry as createProviderRegistry } from 'ai';
import { generateText } from "ai"
import { google, createGoogleGenerativeAI } from "@ai-sdk/google"
import { openai, createOpenAI } from "@ai-sdk/openai"

export type Env = {
    DATABASE_URL: string;
    NODE_ENV: string;
    OPENAI_API_KEY: string;
    GEMINI_API_KEY: string;
};

const generalRouter = new Hono<{ Bindings: Env }>();

generalRouter.get("/", (c) => c.json({ message: "Welcome to EthosAI API!" }));

function getModel(model: string) {
    const modelMap: { [key: string]: () => any } = {
        google: () => google("models/gemini-1.5-flash-latest"),
        openai: () => openai("gpt-4o-mini"),
    };

    return modelMap[model]?.();
}

generalRouter.get("/llm", async (c) => {
    const { prompt } = c.req.query();
    const response = await ky.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent', {
        searchParams: { key: c.env.GEMINI_API_KEY },
        json: { contents: [{ parts: [{ text: prompt }] }] },
        headers: { 'Content-Type': 'application/json' }
    }).json();

    return c.json({ response });
});

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

generalRouter.get("/configs/:id", async (c) => {
    const db = createDbConnection(c.env.DATABASE_URL);
    const id = Number(c.req.param("id"));
    const config = await db
        .select()
        .from(configs)
        .where(eq(configs.id, id))
        .limit(1);
    if (config.length === 0) {
        throw new HTTPException(404, { message: "Config not found" });
    }
    return c.json(config[0]);
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

generalRouter.get("/configs", async (c) => {
    const db = createDbConnection(c.env.DATABASE_URL);
    // const allConfigs = await db.select().from(configs);

    // MOCK DATA
    const allConfigs = {
        "configs": [
            {
                "configFileName": "Best Movies of 21st Century",
                "category": "Entertainment",
                "tags": ["Movies", "Drama"],
                "reviewStatus": "Pending",
                "dateSubmitted": "2023-05-15",
                "lastReviewed": "2023-05-15",
                "submittedBy": {
                    "username": "Alex",
                    "avatarUrl": "public/avatar3.png"
                },
                "numOfReviews": 0
            },
            {
                "configFileName": "Popular Music Artists",
                "category": "Music",
                "tags": ["Pop", "Rock"],
                "reviewStatus": "Audited",
                "dateSubmitted": "2024-01-08",
                "lastReviewed": "2024-03-12",
                "submittedBy": {
                    "username": "Sarah",
                    "avatarUrl": "public/avatar4.png"
                },
                "numOfReviews": 52
            },
            {
                "configFileName": "Famous Historical Figures",
                "category": "History",
                "tags": ["Leaders", "Scientists"],
                "reviewStatus": "Audited",
                "dateSubmitted": "2022-09-27",
                "lastReviewed": "2023-07-18",
                "submittedBy": {
                    "username": "David",
                    "avatarUrl": "public/avatar5.png"
                },
                "numOfReviews": 87
            },
            {
                "configFileName": "Top 10 Programming Languages",
                "category": "Technology",
                "tags": ["Python", "Java", "C++"],
                "reviewStatus": "Pending",
                "dateSubmitted": "2024-07-23",
                "lastReviewed": "2023-05-15",
                "submittedBy": {
                    "username": "Emily",
                    "avatarUrl": "public/avatar6.png"
                },
                "numOfReviews": 0
            },
            {
                "configFileName": "Best-Selling Books of All Time",
                "category": "Literature",
                "tags": ["Fiction", "Non-Fiction"],
                "reviewStatus": "Audited",
                "dateSubmitted": "2023-11-12",
                "lastReviewed": "2024-02-21",
                "submittedBy": {
                    "username": "Michael",
                    "avatarUrl": "public/avatar7.png"
                },
                "numOfReviews": 123
            },
            {
                "configFileName": "Most Popular Tourist Destinations",
                "category": "Travel",
                "tags": ["Europe", "Asia", "North America"],
                "reviewStatus": "Pending",
                "dateSubmitted": "2024-05-07",
                "lastReviewed": "2023-05-15",
                "submittedBy": {
                    "username": "Olivia",
                    "avatarUrl": "public/avatar8.png"
                },
                "numOfReviews": 0
            },
            {
                "configFileName": "Top 100 Movies on IMDb",
                "category": "Entertainment",
                "tags": ["Drama", "Comedy", "Action"],
                "reviewStatus": "Audited",
                "dateSubmitted": "2023-03-25",
                "lastReviewed": "2024-01-15",
                "submittedBy": {
                    "username": "Noah",
                    "avatarUrl": "public/avatar9.png"
                },
                "numOfReviews": 98
            },
            {
                "configFileName": "Best-Selling Video Games of All Time",
                "category": "Gaming",
                "tags": ["Action", "Adventure", "RPG"],
                "reviewStatus": "Pending",
                "dateSubmitted": "2024-08-10",
                "lastReviewed": "2023-05-15",
                "submittedBy": {
                    "username": "Ethan",
                    "avatarUrl": "public/avatar10.png"
                },
                "numOfReviews": 0
            },
            {
                "configFileName": "Most Popular Social Media Platforms",
                "category": "Technology",
                "tags": ["Facebook", "Instagram", "TikTok"],
                "reviewStatus": "Audited",
                "dateSubmitted": "2023-07-05",
                "lastReviewed": "2024-03-29",
                "submittedBy": {
                    "username": "Sophia",
                    "avatarUrl": "public/avatar11.png"
                },
                "numOfReviews": 65
            },
            {
                "configFileName": "Top 10 Most Expensive Cars in the World",
                "category": "Automotive",
                "tags": ["Luxury", "Sports Cars"],
                "reviewStatus": "Pending",
                "dateSubmitted": "2024-06-18",
                "lastReviewed": "2023-05-15",
                "submittedBy": {
                    "username": "Liam",
                    "avatarUrl": "public/avatar12.png"
                },
                "numOfReviews": 0
            }
        ]
    }
    return c.json(allConfigs);
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
