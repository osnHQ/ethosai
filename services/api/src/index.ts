import { Hono } from "hono";
import { cors } from 'hono/cors'
import { HTTPException } from "hono/http-exception";
import { apiReference } from '@scalar/hono-api-reference';
import evaluationRouter from "./core/evaluation";
import apiKeyRouter from "./core/apiKey";
import generalRouter from "./core/general";
import authRouter from "./utils/auth";

const app = new Hono<{ Bindings: Env }>();

app.use('/*', cors())

app.route('/api-key', apiKeyRouter);
app.route('/eval', evaluationRouter);
app.route('/auth', authRouter);
app.route('/', generalRouter);

app.get('/reference', apiReference({
  spec: {
    url: '/openapi.json',
  },
}));

app.onError((err: Error, c) => {
  console.error(`${err}`);
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  return c.json({ error: "Internal Server Error" }, 500);
});

export default app;
