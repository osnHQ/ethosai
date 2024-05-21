import json
import ollama
import pandas
import asyncio
from numpy import dot
from numpy.linalg import norm
from ollama import AsyncClient

from pathlib import Path

file_path = Path("./qa.jsonl")

def load_jsonl():
    with file_path.open("r") as f:
        contents = f.read()
        jsonl_data = []
        lines = contents.splitlines()

        for line in lines:
            jsonl_data.append(json.loads(line))

        return jsonl_data


async def chat(prompt):
  message = {'role': 'user', 'content': prompt}
  response = await AsyncClient().chat(model='qwen:0.5b', messages=[message])
  return response["message"]["content"]


def generate_embedding(prompt):
    response = ollama.embeddings(model='qwen:0.5b', prompt=prompt)
    return response["embedding"]


def cosine_similarity(a, b):
    return dot(a, b) / (norm(a) * norm(b))


def sentence_similarity(a, b):
    x = generate_embedding(a)
    y = generate_embedding(b)
    return cosine_similarity(x, y)


def main():
    jsonl_data =  load_jsonl()
    responses = []
    for pair in jsonl_data:
        response = asyncio.run(chat(pair["question"]))
        print(response)
        responses.append(response)
        print(pair["answer"])
        print(sentence_similarity(response, pair["answer"]))

main()