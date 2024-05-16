import { Hono } from "hono"
import { Ai } from "@cloudflare/ai";

type Bindings = {
    AI: Ai;
  };

const app = new Hono();

const evaluation = new Hono<{ Bindings: Bindings }>();
evaluation.get('/', (c) => c.text('List evaluations'))

evaluation.get('/:id', (c) => {
    const id = c.req.param('id')
    return c.text('Get evaluation: ' + id)
})

evaluation.post('/', (c) => c.text('Create evaluation'))

app.route('/', evaluation)

export default app