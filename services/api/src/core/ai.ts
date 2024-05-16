import { Hono } from "hono"
import { Ai } from "@cloudflare/ai";

type Bindings = {
    AI: Ai;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/ai", async (c) => {
    const { prompt, model } = c.req.query();

    if (!model) {
        return c.text("No model was provided.")
    }

    const ai = new Ai(c.env.AI);
    const response = await ai.run("@hf/thebloke/openhermes-2.5-mistral-7b-awq", {
        prompt,
    });
    return c.json({ response });
});

export default app