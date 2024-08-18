import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";
import { logger } from "hono/logger";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const EvalParamsSchema = z.object({
  evalFileName: z.string().min(1),
  type: z.enum(["Factual", "Bias"]),
  category: z.string().min(1),
  fileId: z.string().uuid(),
  fileOwnerId: z.string().uuid(),
  fileContent: z.string().min(1),
});

type EvalParams = z.infer<typeof EvalParamsSchema>;

const app = new Hono();

app.use("*", cors());
app.use("*", prettyJSON());
app.use("*", logger());

app.use(
  "/api/*",
  jwt({
    secret: "secret",
  })
);

app.get("/", (c) => c.text("EthosAI API is running!"));

const api = app.basePath("/api");

api.post("/evals", zValidator("json", EvalParamsSchema), async (c) => {
  const params = c.req.valid("json");

  try {
    const { evalFileName, fileId, fileContent } = params;
    const key = `evals/${fileId}/${evalFileName}`;

    const decodedFileContent = atob(fileContent);

    // Use AWS S3 to store the file
    await c.env.AWS_S3_BUCKET.put(key, decodedFileContent, {
      httpMetadata: { contentType: "application/octet-stream" },
    });

    return c.json({ message: "Eval file uploaded to S3", fileId, key }, 201);
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    return c.json({ error: "Failed to upload file" }, 500);
  }
});

api.get("/evals/:id", async (c) => {
  const id = c.req.param("id");

  try {
    const fileName = "example.txt";
    const key = `evals/${id}/${fileName}`;

    // Generate a signed URL using AWS S3
    const signedUrl = await c.env.AWS_S3_BUCKET.createSignedUrl({
      key: key,
      expiresIn: 3600, // URL expires in 1 hour
    });

    return c.json({ message: "Eval file access URL generated", signedUrl });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return c.json({ error: "Failed to retrieve file" }, 500);
  }
});

api.delete("/evals/:id", async (c) => {
  const id = c.req.param("id");

  try {
    const fileName = "example.txt";
    const key = `evals/${id}/${fileName}`;

    // Delete the file from AWS S3
    await c.env.AWS_S3_BUCKET.delete(key);

    return c.json({ message: `Eval file ${id} deleted from S3` }, 200);
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    return c.json({ error: "Failed to delete file" }, 500);
  }
});

app.onError((err, c) => {
  console.error(`${err}`);
  if (err instanceof Error) {
    return c.json({ error: err.message }, 400);
  }
  return c.json({ error: "Internal Server Error" }, 500);
});

app.notFound((c) => {
  return c.json({ error: "Not Found" }, 404);
});

export default app;