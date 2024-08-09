import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { apiReference } from '@scalar/hono-api-reference';
import evaluationRouter from "./core/evaluation";
import generalRouter from "./core/general";

const app = new Hono<{ Bindings: Env }>();

app.route('/eval', evaluationRouter);
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
