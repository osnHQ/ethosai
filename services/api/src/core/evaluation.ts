import { Hono } from "hono"

const app = new Hono()

const evaluation = new Hono()
evaluation.get('/', (c) => c.text('List evaluations'))

evaluation.get('/:id', (c) => {
    const id = c.req.param('id')
    return c.text('Get evaluation: ' + id)
})

evaluation.post('/', (c) => c.text('Create evaluation'))

app.route('/', evaluation)

export default app