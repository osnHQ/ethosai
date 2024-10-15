import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { and, eq, sql } from 'drizzle-orm';
import { createDbConnection } from '../utils/functions';  // Assuming you have this in your utils
import { apiKey, users } from '../db/schema';
import { v4 as uuidv4 } from 'uuid';

export type Env = {
  DATABASE_URL: string;
};

const apiKeyRouter = new Hono<{ Bindings: Env }>();

const generateApiKey = (): string => {
  return `sk-${uuidv4()}`;
};

apiKeyRouter.post(
  "/generate",
  zValidator(
    "json",
    z.object({
      clientId: z.number().int(),
    })
  ),
  async (c) => {
    const db = createDbConnection(c.env.DATABASE_URL);
    const { clientId } = c.req.valid("json");

    try {
      const client = await db
        .select()
        .from(users)
        .where(eq(users.id, clientId))
        .limit(1);

      if (client.length === 0) {
        return c.json({ error: "Client not found" }, 404);
      }

      const newApiKey = generateApiKey();

      await db
        .insert(apiKey)
        .values({
          clientId,
          apiKey: newApiKey,
          queryCount: 0,
          isActive: true,
          isDeleted: false,
        });

      return c.json({ message: "API key generated", apiKey: newApiKey });
    } catch (error) {
      console.error("Error generating API key:", error);
      return new HTTPException(500, { message: "API key generation failed" }).getResponse();
    }
  }
);

apiKeyRouter.get(
  "/details",
  zValidator(
    "query",
    z.object({
      apiKey: z.string(),
    })
  ),
  async (c) => {
    const db = createDbConnection(c.env.DATABASE_URL);
    const { apiKey: key } = c.req.valid("query");

    try {
      const keyDetails = await db
        .select()
        .from(apiKey)
        .where(eq(apiKey.apiKey, key))
        .limit(1);

      if (keyDetails.length === 0) {
        return c.json({ error: "API key not found" }, 404);
      }

      return c.json({ apiKey: keyDetails[0] });
    } catch (error) {
      console.error("Error fetching API key details:", error);
      return new HTTPException(500, { message: "Failed to fetch API key details" }).getResponse();
    }
  }
);

apiKeyRouter.get(
  "/user/:userId/apiKeys",
  zValidator(
    "query",
    z.object({
      userId: z.string(),
    })
  ),
  async (c) => {
    const db = createDbConnection(c.env.DATABASE_URL);
    const { userId } = c.req.valid("query");

    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, Number(userId)))
        .limit(1);

      if (user.length === 0) {
        return c.json({ error: "User not found" }, 404);
      }

      const apiKeys = await db
        .select()
        .from(apiKey)
        .where(eq(apiKey.clientId, Number(userId)));

      if (apiKeys.length === 0) {
        return c.json({ message: "No API keys found for this user" }, 404);
      }

      return c.json({ apiKeys });
    } catch (error) {
      console.error("Error fetching API keys:", error);
      return new HTTPException(500, { message: "Failed to fetch API keys" }).getResponse();
    }
  }
);


apiKeyRouter.post(
  "/deactivate",
  zValidator(
    "json",
    z.object({
      apiKey: z.string(),
    })
  ),
  async (c) => {
    const db = createDbConnection(c.env.DATABASE_URL);
    const { apiKey: key } = c.req.valid("json");

    try {
      const result = await db
        .update(apiKey)
        .set({ isActive: false })
        .where(and(eq(apiKey.apiKey, key), eq(apiKey.isActive, true)));

      if (result.rowCount === 0) {
        return c.json({ error: "API key not found or already deactivated" }, 404);
      }

      return c.json({ message: "API key deactivated successfully" });
    } catch (error) {
      console.error("Error deactivating API key:", error);
      return new HTTPException(500, { message: "Failed to deactivate API key" }).getResponse();
    }
  }
);

apiKeyRouter.post(
  "/delete",
  zValidator(
    "json",
    z.object({
      apiKey: z.string(),
    })
  ),
  async (c) => {
    const db = createDbConnection(c.env.DATABASE_URL);
    const { apiKey: key } = c.req.valid("json");

    try {
      const result = await db
        .update(apiKey)
        .set({ isDeleted: true, isActive: false })
        .where(and(eq(apiKey.apiKey, key), eq(apiKey.isDeleted, false)));

      if (result.rowCount === 0) {
        return c.json({ error: "API key not found or already deleted" }, 404);
      }

      return c.json({ message: "API key deleted successfully" });
    } catch (error) {
      console.error("Error deleting API key:", error);
      return new HTTPException(500, { message: "Failed to delete API key" }).getResponse();
    }
  }
);

apiKeyRouter.post(
  "/incrementQueryCount",
  zValidator(
    "json",
    z.object({
      apiKey: z.string(),
    })
  ),
  async (c) => {
    const db = createDbConnection(c.env.DATABASE_URL);
    const { apiKey: key } = c.req.valid("json");

    try {
      const result = await db
        .update(apiKey)
        .set({ queryCount: sql`${apiKey.queryCount} + 1` })
        .where(and(eq(apiKey.apiKey, key), eq(apiKey.isActive, true)));

      if (result.rowCount === 0) {
        return c.json({ error: "API key not found or inactive" }, 404);
      }

      return c.json({ message: "Query count incremented successfully" });
    } catch (error) {
      console.error("Error incrementing query count:", error);
      return new HTTPException(500, { message: "Failed to increment query count" }).getResponse();
    }
  }
);

export default apiKeyRouter;
