import concurrent.futures
import json
import logging
import os
import asyncio
from functools import partial
from pathlib import Path
from typing import Any, Dict, List

import pandas as pd
import pymupdf
import streamlit as st
from dotenv import load_dotenv
from rapidfuzz import fuzz
from uuid import uuid4

from openai import AsyncOpenAI

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.FileHandler("app.log"), logging.StreamHandler()],
)
logger = logging.getLogger(__name__)


def extract_text_from_pdf(pdf_path: str) -> List[str]:
    with pymupdf.open(pdf_path) as doc:
        return [page.get_text() for page in doc]

async def generate_qa_from_text(text: str, client: AsyncOpenAI, model: str = "gpt-4o-mini") -> str:
    prompt = (
        f"Generate interesting yet general questions to ask in an exam, short one or few word answer factual factoid question answer set from the following text as a table: {text}"
    )
    try:
        response = await client.chat.completions.create(
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
    except Exception as e:
        logger.error(f"Error generating QA from text: {e}")
        return ""

def process_pdf_batch(batch_text: str, client: AsyncOpenAI, model: str = "gpt-4o-mini") -> str:
    return asyncio.run(generate_qa_from_text(batch_text, client, model))

def process_pdf_in_parallel(
    pdf_path: str, batch_size: int = 5, max_workers: int = 50, model: str = "gpt-4o-mini", client: AsyncOpenAI = None
) -> List[str]:
    pages = extract_text_from_pdf(pdf_path)
    batches = [
        "".join(pages[i : i + batch_size]) for i in range(0, len(pages), batch_size)
    ]
    
    total_batches = len(batches)
    progress_bar = st.progress(0)
    
    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        process_func = partial(process_pdf_batch, client=client, model=model)
        futures = [executor.submit(process_func, batch) for batch in batches]
        
        for i, future in enumerate(concurrent.futures.as_completed(futures)):
            results.append(future.result())
            progress_bar.progress((i + 1) / total_batches)

    return results

async def generate_model_answer(prompt: str, client: AsyncOpenAI, model: str = "gpt-4o-mini") -> str:
    try:
        response = await client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "reply very crisp factoid answer."},
                {"role": "user", "content": prompt},
            ],
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"Error generating model answer: {e}")
        return ""

async def compare_sentences_llm(
    ai_reply: str,
    correct_reply: str,
    question: str,
    context: str = "",
    client: AsyncOpenAI = None,
    model: str = "gpt-4o-mini",
) -> str:
    prompt = f"""
You will be given three inputs from {context}:

Source Question: The question that was asked to the AI agent.
AI Agent Reply: The response provided by the AI agent.
Correct Reply: The factually accurate response.

Your task is to:
1. Compare the AI Agent Reply to the Correct Reply.
2. Identify factual differences, inaccuracies, or missing information.
3. Do not penalize for additional clarifications or explanations provided by the AI Agent, as long as the response is factually accurate and relevant to the question.
4. Provide a factual accuracy score as factual_accuracy key in JSON response between 0 and 100, where:
  - For factual or numerical answers (e.g., dates, quantities, measurements): A score of 100 indicates the answer is exactly correct, while minor discrepancies (e.g., close but incorrect values) should result in a proportionally lower score. 
  - For textual, descriptive, or interpretive answers: A score of 100 indicates that the answer is factually accurate and aligns with the expected information. Partial correctness (e.g., correct in some aspects but missing or wrong in others) should result in a lower score.
  - 0 means the answer is completely incorrect.
  - 100 means the AI Agent Reply is perfectly accurate and factually aligned with the Correct Reply.
  - 0 means the AI Agent Reply is completely inaccurate and does not match the Correct Reply.

Afterward, list the key factual differences as factual_differences key in JSON and explain the reasoning behind the assigned score as score_explanation key in JSON.

Return a JSON object with the following structure:

{{
    "factual_accuracy": <integer between 0 and 100>,
    "factual_differences": <string>,
    "score_explanation": <string>
}}

Source Question: '{question}'
AI Agent Reply: '{ai_reply}'
Correct Reply: '{correct_reply}'
"""
    try:
        response = await client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "sentence-similarity",
                    "strict": True,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "factual_accuracy": {"type": "number"},
                            "factual_differences": {"type": "string"},
                            "score_explanation": {"type": "string"},
                        },
                        "required": [
                            "factual_accuracy",
                            "factual_differences",
                            "score_explanation",
                        ],
                        "additionalProperties": False,
                    },
                },
            },
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"Error comparing sentences with LLM: {e}")
        return json.dumps({
            "factual_accuracy": 0,
            "factual_differences": "Error occurred during comparison.",
            "score_explanation": str(e),
        })

def compare_sentences_fuzzy(x: str, y: str) -> str:
    ratio = fuzz.ratio(x.lower(), y.lower())
    partial_ratio = fuzz.partial_ratio(x.lower(), y.lower())
    token_sort_ratio = fuzz.token_sort_ratio(x, y)
    token_set_ratio = fuzz.token_set_ratio(x, y)

    if (
        ratio > 80
        or partial_ratio > 90
        or token_sort_ratio > 80
        or token_set_ratio > 80
    ):
        return "Sentences are similar"
    else:
        return "Sentences are different"

def check_exact_match(x: str, y: str) -> bool:
    return x.lower() == y.lower()

def check_partial_match(x: str, y: str) -> bool:
    return x.lower() in y.lower() or y.lower() in x.lower()

async def compare_sentences(
    x: str, y: str, context: str = "", client: AsyncOpenAI = None, model: str = "gpt-4o-mini"
) -> Dict[str, Any]:
    llm_result = await compare_sentences_llm(
        x, y, "Compare these sentences", context=context, client=client, model=model
    )
    return {
        "fuzzy": compare_sentences_fuzzy(x, y),
        "exact": check_exact_match(x, y),
        "includes": check_partial_match(x, y),
        "llm": llm_result,
    }

def flatten_similarity_results(similarity_dict: Dict[str, Any]) -> Dict[str, Any]:
    flattened = {
        "Fuzzy_Comparison": similarity_dict["fuzzy"],
        "Exact_Match": similarity_dict["exact"],
        "Includes_Match": similarity_dict["includes"],
    }

    try:
        llm_comparison = json.loads(similarity_dict["llm"])
    except json.JSONDecodeError as e:
        logger.error(f"Error decoding JSON from LLM comparison: {e}")
        llm_comparison = {
            "factual_accuracy": 0,
            "factual_differences": "Invalid JSON format.",
            "score_explanation": str(e),
        }

    flattened.update(
        {
            "Factual_Accuracy": llm_comparison.get("factual_accuracy", 0),
            "Factual_Differences": llm_comparison.get("factual_differences", ""),
            "Score_Explanation": llm_comparison.get("score_explanation", ""),
        }
    )

    return flattened

def save_qa_to_jsonl(qa_tables: List[str], output_file: Path) -> None:
    with open(output_file, "w", encoding="utf-8") as jsonlfile:
        for table in qa_tables:
            try:
                qa_dict = json.loads(table)
                for qa in qa_dict["questions"]:
                    jsonlfile.write(json.dumps(qa) + "\n")
            except Exception as e:
                logger.error(f"Error saving QA to JSONL: {e}")
                continue

def load_jsonl(file) -> List[Dict[str, str]]:
    return [json.loads(line.decode("utf-8")) for line in file]

def initialize_session_state() -> None:
    if "df" not in st.session_state:
        st.session_state.df = pd.DataFrame(columns=["question", "answer"])
    if "processed" not in st.session_state:
        st.session_state.processed = False


async def process_questions(
    jsonl_data: List[Dict[str, str]], context: str = "", client=None, model: str = "gpt-4o-mini"
) -> None:
    columns = ["Question", "Model_Response", "Expected_Answer"]
    results_df = pd.DataFrame(columns=columns)

    progress_bar = st.progress(0)
    table_container = st.empty()
    total = len(jsonl_data)

    semaphore = asyncio.Semaphore(50)

    async def process_single_question(pair):
        async with semaphore:
            try:
                response = (
                    await generate_model_answer(f"{context} {pair['question']}", client, model=model)
                ).strip(".")
                
                similarity = await compare_sentences(
                    response, pair["answer"], context=context, client=client, model=model
                )
                
                flattened_similarity = flatten_similarity_results(similarity)

                result = {
                    "Question": pair["question"],
                    "Model_Response": response,
                    "Expected_Answer": pair["answer"],
                    **flattened_similarity,
                }
                return result
            except Exception as e:
                return {
                    "Question": pair["question"],
                    "Model_Response": "Error",
                    "Expected_Answer": pair["answer"],
                    "Fuzzy_Comparison": "",
                    "Exact_Match": "",
                    "Includes_Match": "",
                    "Factual_Accuracy": 0,
                    "Factual_Differences": "",
                    "Score_Explanation": str(e),
                }

    tasks = [process_single_question(pair) for pair in jsonl_data]
    results = []

    for i, task in enumerate(asyncio.as_completed(tasks), 1):
        result = await task
        results.append(result)
        results_df = pd.DataFrame(results)
        
        progress_bar.progress(i / total)
        table_container.table(results_df)

    csv = results_df.to_csv(index=False)
    file_path = f"./results/{uuid4().hex}.csv"
    results_df.to_csv(file_path, index=False)

    st.download_button(
        label="Download results as CSV",
        data=csv,
        file_name="qa_results.csv",
        mime="text/csv",
        key="download_csv",
    )


def main() -> None:
    st.set_page_config(layout="wide")
    st.title("EthosAI")

    initialize_session_state()

    st.sidebar.title("Configuration")

    load_dotenv()
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

    if OPENAI_API_KEY:
        os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY
    else:
        api_key_input = st.sidebar.text_input("OpenAI API Key", type="password")
        if api_key_input:
            os.environ["OPENAI_API_KEY"] = api_key_input
        else:
            st.error("Please enter your OpenAI API key in the sidebar.")
            st.stop()

    client = AsyncOpenAI(
        api_key=os.environ.get("OPENAI_API_KEY"),
    )

    model = st.sidebar.selectbox(
        "Select Model", ["gpt-4o-mini", "gpt-3.5-turbo", "gpt-4"]
    )
    batch_size = st.sidebar.number_input(
        "Batch Size", min_value=1, max_value=10, value=5
    )
    max_workers = st.sidebar.number_input(
        "Max Workers", min_value=1, max_value=50, value=50
    )
    context = st.sidebar.text_input("Enter context for the questions", "")

    uploaded_file = st.file_uploader("Upload a PDF or CSV file", type=["pdf", "csv"])

    if uploaded_file is not None and not st.session_state.processed:
        file_extension = uploaded_file.name.split(".")[-1].lower()

        if file_extension == "csv":
            st.session_state.df = pd.read_csv(uploaded_file)
            st.session_state.processed = True

        elif file_extension == "pdf":
            pdf_path = f"/tmp/{uploaded_file.name}"

            with open(pdf_path, "wb") as f:
                f.write(uploaded_file.getbuffer())

            qa_tables = process_pdf_in_parallel(
                pdf_path, batch_size=batch_size, max_workers=max_workers, model=model, client=client
            )

            jsonl_output_file = "/tmp/output.jsonl"
            save_qa_to_jsonl(qa_tables, jsonl_output_file)

            with open(jsonl_output_file, "rb") as file:
                jsonl_data = load_jsonl(file)
                st.session_state.df = pd.json_normalize(jsonl_data)
                st.session_state.processed = True

    if st.session_state.processed and not st.session_state.df.empty:
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
                    edited_df.to_dict("records"), context=context, client=client, model=model
                )
            )

if __name__ == "__main__":
    main()
