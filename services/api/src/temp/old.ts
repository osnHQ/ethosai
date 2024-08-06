import { Hono } from "hono";
import { cors } from "hono/cors";
import { basicAuth } from "hono/basic-auth";
import { logger } from "hono/logger";

import evaluation from "./core/evaluation";
import submission from "./core/submission";

import { models } from "./utils/models";

const app = new Hono();

app.use("*", logger());

app.use(
  "/*",
  cors({
    origin: ["http://localhost:3000", "https://openqa.ai"],
  }),
);

app.use(
  "/auth/*",
  basicAuth({
    username: "admin",
    password: "admin",
  }),
);

app.use("/api/*", async (c, next) => {
  await next();
  c.header("X-message", "Powered by OpenQA.ai!");
});

app.use("*", async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  c.header("X-Response-Time", `${ms}ms`);
});

app.notFound((c) => {
  return c.text("Route Not Found", 404);
});

app.onError((err, c) => {
  console.error(`${err}`);
  return c.text(`${err}`, 500);
});

app.get("/", (c) => c.text("Welcome to OpenQA.ai!"));

app.get("/ai", async (c) => {
  const { prompt, model } = c.req.query();

  console.log(prompt);
  console.log(model);

  if (!model) {
    return c.text("No model was provided.");
  }
  // else if (!models.map((model) => model.name).includes(model)) {
  //   return c.text(`Model ${model} is not supported.`)
  // }

  const response = await c.env.AI.run("@cf/meta/llama-3-8b-instruct", {
    prompt,
  });
  return c.json(response);
});

app.get("/models", async (c) => {
  const response = { models };
  return c.json({ response });
});

app.route("/evaluation", evaluation);
app.route("/submission", submission);

app.get("/redirect", (c) => c.redirect("/"));
app.get("/auth/*", (c) => c.text("You are authorized"));

app.get("/error", () => {
  throw Error("Error has occurred");
});

export default app;
