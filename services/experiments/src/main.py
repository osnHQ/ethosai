import streamlit as st
import pandas as pd
import json
import ollama
import asyncio
from numpy import dot
from numpy.linalg import norm
from ollama import AsyncClient

st.title("OpenQA.ai")

uploaded_file = st.file_uploader("Upload a JSONL file", type=["jsonl"])

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

def process_jsonl(file):
    jsonl_data = []
    for line in file:
        jsonl_data.append(json.loads(line.decode("utf-8")))
    return jsonl_data

if uploaded_file is not None:
    jsonl_data = process_jsonl(uploaded_file)
    df = pd.json_normalize(jsonl_data)
    st.write(df)

    async def main():
        results = []
        table_container = st.empty()
        
        for pair in jsonl_data:
            response = await chat(pair["question"])
            similarity = sentence_similarity(response, pair["answer"])
            results.append({
                "Question": pair["question"],
                "Model Response": response,
                "Expected Answer": pair["answer"],
                "Similarity": f"{similarity:.4f}"
            })
            
            results_df = pd.DataFrame(results)
            table_container.table(results_df)

    asyncio.run(main())
