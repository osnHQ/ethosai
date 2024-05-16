import { Hono } from "hono"
import { prettyJSON } from 'hono/pretty-json'

const app = new Hono()

const submission = new Hono()
submission.get('/', (c) => c.text('List submissions'))

submission.get('/:id', prettyJSON(), (c) => {
    const id = c.req.param('id')
    console.log('Getting submission: ' + id)
    const submission = [
        { input: 'Hello', output: 'Hi' },
        { input: 'Goodbye', output: 'Bye' }
    ]
    return c.json(submission)
})

app.post('/submission', (c) => c.json({ message: 'Created!' }, 201))

app.route('/', submission)

export default app