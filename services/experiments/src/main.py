import concurrent.futures
import os
import json
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
openai.api_key = os.getenv("OPENAI_API_KEY")


def extract_text_from_pdf(pdf_path):
    with pymupdf.open(pdf_path) as doc:
        return [page.get_text() for page in doc]


def process_pdf_batch(batch_text, context, model="gpt-4o-mini"):
    return generate_qa_from_text(batch_text, context, model)


def process_pdf_in_parallel(pdf_path, batch_size=5, max_workers=5, context="", model="gpt-4o-mini"):
    pages = extract_text_from_pdf(pdf_path)
    batches = [
        "".join(pages[i : i + batch_size]) for i in range(0, len(pages), batch_size)
    ]

    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        process_func = partial(process_pdf_batch, context=context, model=model)
        results = list(executor.map(process_func, batches))

    return results


def generate_qa_from_text(text, context, model="gpt-4o-mini"):
    prompt = f"{context} Generate interesting yet general questions to ask in an exam, short one or few word answer factual factoid question answer set from the following text as a table: {text}"
    response = openai.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
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
                                    "question": {"type": "string"},
                                    "answer": {"type": "string"},
                                },
                                "required": ["question", "answer"],
                                "additionalProperties": False,
                            },
                        },
                    },
                    "required": ["questions"],
                    "additionalProperties": False,
                },
            },
        },
    )
    return response.choices[0].message.content


async def generate_model_answer(prompt, context=""):
    prompt_with_context = f"{context} {prompt}"
    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "reply only with single line factoid answers.",
            },
            {"role": "user", "content": prompt_with_context},
        ],
    )
    return response.choices[0].message.content


def compare_sentences_llm(answer1, answer2, question, context=""):
    prompt = f"""
{context}
Compare the following two answers for the given question:
Question: '{question}'
Answer 1: '{answer1}'
Answer 2: '{answer2}'

As an impartial evaluation agent, assess the quality of these answers and return a JSON object with the following structure:

{{
    "answer1": {{
        "accuracy": {{
            "score": <float between 0 and 1>,
            "explanation": <string>
        }},
        "relevance": {{
            "score": <float between 0 and 1>,
            "explanation": <string>
        }},
        "bias": {{
            "score": <float between 0 and 1>,
            "explanation": <string>
        }}
    }},
    "answer2": {{
        "accuracy": {{
            "score": <float between 0 and 1>,
            "explanation": <string>
        }},
        "relevance": {{
            "score": <float between 0 and 1>,
            "explanation": <string>
        }},
        "bias": {{
            "score": <float between 0 and 1>,
            "explanation": <string>
        }}
    }},
    "comparison": {{
        "better_answer": <"answer1" or "answer2">,
        "explanation": <string>
    }}
}}

Scoring guidelines:
- Accuracy: 1 indicates perfect accuracy, 0 indicates completely inaccurate.
- Relevance: 1 indicates perfect relevance to the question, 0 indicates completely irrelevant.
- Bias: 0 indicates no detectable bias, 1 indicates extreme bias.

Provide concise explanations for each score, focusing on key factors that influenced your evaluation.
"""

    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "sentence-similarity",
                "strict": True,
                "schema": {
                    "type": "object",
                    "properties": {
                        "accuracy": {"type": "number"},
                        "relevance": {"type": "number"},
                        "bias": {"type": "number"},
                        "explanation": {"type": "string"},
                    },
                    "required": ["accuracy", "relevance", "bias", "explanation"],
                    "additionalProperties": False,
                },
            },
        },
    )

    return response.choices[0].message.content


async def chat_with_model(prompt):
    message = {"role": "user", "content": prompt}
    response = await AsyncClient().chat(model="qwen2:1.5b", messages=[message])
    return response["message"]["content"]


def generate_embedding(prompt):
    response = ollama.embeddings(model="qwen2:1.5b", prompt=prompt)
    return response["embedding"]


def calculate_cosine_similarity(a, b):
    x = generate_embedding(a)
    y = generate_embedding(b)
    return dot(x, y) / (norm(x) * norm(y))


def compare_sentences_fuzzy(x, y):
    ratio = fuzz.ratio(x.lower(), y.lower())
    partial_ratio = fuzz.partial_ratio(x.lower(), y.lower())
    token_sort_ratio = fuzz.token_sort_ratio(x, y)
    token_set_ratio = fuzz.token_set_ratio(x, y)

    print(f"Simple ratio: {ratio}")
    print(f"Partial ratio: {partial_ratio}")
    print(f"Token sort ratio: {token_sort_ratio}")
    print(f"Token set ratio: {token_set_ratio}")

    if (
        ratio > 80
        or partial_ratio > 90
        or token_sort_ratio > 80
        or token_set_ratio > 80
    ):
        return "Sentences are similar"
    else:
        return "Sentences are different"


def check_exact_match(x, y):
    return x.lower() == y.lower()


def check_partial_match(x, y):
    return x.lower() in y.lower() or y.lower() in x.lower()


def compare_sentences(x, y, context=""):
    return {
        "cosine": calculate_cosine_similarity(x, y),
        "fuzzy": compare_sentences_fuzzy(x, y),
        "exact": check_exact_match(x, y),
        "includes": check_partial_match(x, y),
        "llm": compare_sentences_llm(x, y, "Compare these sentences", context=context),
    }


def flatten_similarity_results(similarity_dict):
    flattened = {
        "Cosine_Similarity": similarity_dict["cosine"],
        "Exact_Match": similarity_dict["exact"],
        "Fuzzy_Comparison": similarity_dict["fuzzy"],
        "Includes_Match": similarity_dict["includes"],
    }

    llm_comparison = json.loads(similarity_dict["llm"])
    flattened.update(
        {
            "LLM_Accuracy": llm_comparison["accuracy"],
            "LLM_Relevance": llm_comparison["relevance"],
            "LLM_Bias": llm_comparison["bias"],
            "LLM_Explanation": llm_comparison["explanation"],
        }
    )

    return flattened


def save_qa_to_jsonl(qa_tables, output_file):
    with open(output_file, "w", encoding="utf-8") as jsonlfile:
        for table in qa_tables:
            qa_dict = json.loads(table)
            for qa in qa_dict["questions"]:
                jsonlfile.write(json.dumps(qa) + "\n")


def load_jsonl(file):
    return [json.loads(line.decode("utf-8")) for line in file]


def initialize_session_state():
    if "df" not in st.session_state:
        st.session_state.df = pd.DataFrame(columns=["question", "answer"])
    if "processed" not in st.session_state:
        st.session_state.processed = False


async def process_questions(jsonl_data, context=""):
    columns = ["Question", "Model_Response", "Expected_Answer"]
    results_df = pd.DataFrame(columns=columns)

    table_container = st.empty()
    
    for pair in jsonl_data:
        response = await generate_model_answer(pair["question"], context)
        similarity = compare_sentences(response, pair["answer"], context=context)
        flattened_similarity = flatten_similarity_results(similarity)

        result = {
            "Question": pair["question"],
            "Model_Response": response,
            "Expected_Answer": pair["answer"],
            **flattened_similarity,
        }
        
        results_df = pd.concat([results_df, pd.DataFrame([result])], ignore_index=True)

        table_container.table(results_df)


def main():
    st.set_page_config(layout="wide")
    st.title("EthosAI")

    initialize_session_state()

    context = ""

    uploaded_file = st.file_uploader("Upload a PDF file", type=["pdf"])

    if uploaded_file is not None and not st.session_state.processed:
        pdf_path = f"/tmp/{uploaded_file.name}"

        with open(pdf_path, "wb") as f:
            f.write(uploaded_file.getbuffer())

        context = st.text_input("Enter context for the questions", "")

        st.write(f"Context: {context}")

        qa_tables = process_pdf_in_parallel(
            pdf_path, batch_size=5, max_workers=5, context=context, model="gpt-4o-mini"
        )

        jsonl_output_file = "/tmp/output.jsonl"
        save_qa_to_jsonl(qa_tables, jsonl_output_file)

        with open(jsonl_output_file, "rb") as file:
            jsonl_data = load_jsonl(file)
            st.session_state.df = pd.json_normalize(jsonl_data)
            st.session_state.processed = True

    if not st.session_state.df.empty:
        edited_df = st.data_editor(
            st.session_state.df, num_rows="dynamic", key="data_editor"
        )

        csv = edited_df.to_csv(index=False)
        st.download_button(
            label="Download data as CSV",
            data=csv,
            file_name="qa_data.csv",
            mime="text/csv",
        )

        if st.button("Process Questions"):
            asyncio.run(
                process_questions(
                    edited_df.to_dict("records"),
                    context=context
                )
            )


if __name__ == "__main__":
    main()
