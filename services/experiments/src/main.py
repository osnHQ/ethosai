import concurrent.futures
import os
import json
import csv
import openai
import pymupdf
import streamlit as st
import pandas as pd
import ollama
import asyncio
from functools import partial
from numpy import dot
from numpy.linalg import norm
from ollama import AsyncClient
from fuzzywuzzy import fuzz
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

def extract_text_from_pdf(pdf_path):
    with pymupdf.open(pdf_path) as doc:
        return [page.get_text() for page in doc]

def generate_qa_from_text(text, model="gpt-4o-mini"):
    prompt = f"Generate interesting yet general questions to ask in an exam, short one or few word answer factual factoid question answer set from the following text as a table: {text}"
    response = openai.chat.completions.create(
        messages=[{
            "role": "user",
            "content": prompt,
        }],
        model=model,
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "qa-set",
                "strict": True,
                "schema": {
                    "type": "object",
                    "properties": {
                        "questions": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "question": {
                                        "type": "string"
                                    },
                                    "answer": {
                                        "type": "string"
                                    }
                                },
                                "required": ["question", "answer"],
                                "additionalProperties": False
                            }
                        },
                    },
                    "required": ["questions"],
                    "additionalProperties": False
                }
            }
        })
    return response.choices[0].message.content

def process_batch(batch_text, model):
    return generate_qa_from_text(batch_text, model)

def process_pdf_in_parallel(pdf_path, batch_size=5, max_workers=5, model="gpt-4o-mini"):
    pages = extract_text_from_pdf(pdf_path)
    batches = [
        "".join(pages[i:i + batch_size])
        for i in range(0, len(pages), batch_size)
    ]

    with concurrent.futures.ThreadPoolExecutor(
            max_workers=max_workers) as executor:
        process_func = partial(process_batch, model=model)
        results = list(executor.map(process_func, batches))

    return results

def save_to_jsonl(qa_tables, output_file):
    with open(output_file, 'w', encoding='utf-8') as jsonlfile:
        for table in qa_tables:
            qa_dict = json.loads(table)
            for qa in qa_dict['questions']:
                jsonlfile.write(json.dumps(qa) + '\n')

st.title("EthosAI")

uploaded_file = st.file_uploader("Upload a PDF file", type=["pdf"])

async def chat(prompt):
    message = {'role': 'user', 'content': prompt}
    response = await AsyncClient().chat(model='qwen2:1.5b', messages=[message])
    return response["message"]["content"]

def generate_embedding(prompt):
    response = ollama.embeddings(model='qwen2:1.5b', prompt=prompt)
    return response["embedding"]

def cosine_similarity(a, b):
    x = generate_embedding(a)
    y = generate_embedding(b)
    return dot(x, y) / (norm(x) * norm(y))

def fuzzy_compare_sentences(x, y):
    ratio = fuzz.ratio(x.lower(), y.lower())
    partial_ratio = fuzz.partial_ratio(x.lower(), y.lower())
    token_sort_ratio = fuzz.token_sort_ratio(x, y)
    token_set_ratio = fuzz.token_set_ratio(x, y)

    print(f"Simple ratio: {ratio}")
    print(f"Partial ratio: {partial_ratio}")
    print(f"Token sort ratio: {token_sort_ratio}")
    print(f"Token set ratio: {token_set_ratio}")

    if ratio > 80 or partial_ratio > 90 or token_sort_ratio > 80 or token_set_ratio > 80:
        return "Sentences are similar"
    else:
        return "Sentences are different"

def exact_similarity(x, y):
    return x.lower() is y.lower()


def includes_similarity(x, y):
    return x in y or y in x


def sentence_similarity(x, y):
    response = {
        'cosine': cosine_similarity(x, y),
        'fuzzy': fuzzy_compare_sentences(x, y),
        'exact': exact_similarity(x, y),
        'includes': includes_similarity(x, y)
    }
    return response

def process_jsonl(file):
    jsonl_data = []
    for line in file:
        jsonl_data.append(json.loads(line.decode("utf-8")))
    return jsonl_data

if uploaded_file is not None:
    pdf_path = f"/tmp/{uploaded_file.name}"

    print(pdf_path)

    with open(pdf_path, "wb") as f:
        f.write(uploaded_file.getbuffer())


    qa_tables = process_pdf_in_parallel(pdf_path, batch_size=5, max_workers=5, model="gpt-4o-mini")


    jsonl_output_file = "/tmp/output.jsonl"
    save_to_jsonl(qa_tables, jsonl_output_file)


    with open(jsonl_output_file, "rb") as file:
        jsonl_data = process_jsonl(file)
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
                    "Similarity": similarity
                })

                results_df = pd.DataFrame(results)
                table_container.table(results_df)

        asyncio.run(main())
