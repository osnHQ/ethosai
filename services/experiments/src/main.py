import concurrent.futures
import json
import logging
import os
import asyncio
from functools import partial
from pathlib import Path
from typing import Dict, List

import pandas as pd
import pymupdf
import streamlit as st
from dotenv import load_dotenv
from uuid import uuid4

from openai import AsyncOpenAI

import matplotlib.pyplot as plt

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.FileHandler("app.log"), logging.StreamHandler()],
)
logger = logging.getLogger(__name__)

def extract_text_from_pdf(pdf_path: str) -> List[str]:
    with pymupdf.open(pdf_path) as doc:
        return [page.get_text() for page in doc]

async def generate_qa_from_text(
    text: str, client: AsyncOpenAI, model: str = "gpt-4o-mini"
) -> str:
    prompt = f"Generate short one or few word answer factual factoid question answer set from the following text as a table: {text}"
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

def process_pdf_batch(
    batch_text: str, client: AsyncOpenAI, model: str = "gpt-4o-mini"
) -> str:
    return asyncio.run(generate_qa_from_text(batch_text, client, model))

def process_pdf_in_parallel(
    pdf_path: str,
    batch_size: int = 5,
    max_workers: int = 50,
    model: str = "gpt-4o-mini",
    client: AsyncOpenAI = None,
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

async def generate_model_answer(
    prompt: str, client: AsyncOpenAI, model: str = "gpt-4o-mini"
) -> str:
    try:
        response = await client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": "reply with a one or few words short factoid answer.",
                },
                {"role": "user", "content": prompt},
            ],
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"Error generating model answer: {e}")
        return ""

async def compare_sentences_llm(
    model_answer: str,
    expert_answer: str,
    question: str,
    context: str = "",
    client: AsyncOpenAI = None,
    model: str = "gpt-4o-mini",
) -> str:
    prompt = f"""
You are comparing a submitted answer to an expert answer on a given question. Here is the data:
  [BEGIN DATA]
  [Context]: {context}
  [Question]: {question}
  [Expert]: {expert_answer}
  [Submission]: {model_answer}
  [END DATA]

  Compare the factual content of the submitted answer with the expert answer. Ignore any differences in style, grammar, or punctuation.
  The submitted answer may either be a subset or superset of the expert answer, or it may conflict with it. Determine which case applies. Answer the question by selecting one of the following options:
  (A) The submitted answer is a subset of the expert answer and is fully consistent with it.
  (B) The submitted answer is a superset of the expert answer and is fully consistent with it.
  (C) The submitted answer contains all the same details as the expert answer.
  (D) There is a disagreement between the submitted answer and the expert answer.
  (E) The answers differ, but these differences don't matter from the perspective of factuality.
choice_scores:
  "A": 0.4
  "B": 0.6
  "C": 1
  "D": 0
  "E": 1

  return the answer as a json object with the following structure:
  {{
    "choice": <string>,
    "score": <float>
  }}
"""
    try:
        response = await client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "choice-scoring",
                    "strict": True,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "choice": {"type": "string"},
                            "score": {"type": "number"},
                        },
                        "required": [
                            "choice",
                            "score",
                        ],
                        "additionalProperties": False,
                    },
                },
            },
        )
        response = response.choices[0].message.content
        return json.loads(response)
    except Exception as e:
        logger.error(f"Error comparing sentences with LLM: {e}")
        return json.dumps(
            {
                "choice": f"error: {str(e)}",
                "score": 0,
            }
        )

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
    jsonl_data: List[Dict[str, str]],
    context: str = "",
    client=None,
    model: str = "gpt-4o-mini",
) -> None:
    columns = ["Question", "Model_Response", "Expected_Answer", "Choice", "Score"]
    results_df = pd.DataFrame(columns=columns)

    progress_bar = st.progress(0)
    table_container = st.empty()
    total = len(jsonl_data)

    semaphore = asyncio.Semaphore(50)

    async def process_single_question(pair):
        async with semaphore:
            try:
                response = (
                    await generate_model_answer(
                        f"{context}, {pair['question']}", client, model=model
                    )
                ).strip(".")

                similarity = await compare_sentences_llm(
                    model_answer=response,
                    expert_answer=pair["answer"],
                    question=pair["question"],
                    context=context,
                    client=client,
                    model=model
                )

                result = {
                    "Question": pair["question"],
                    "Model_Response": response,
                    "Expected_Answer": pair["answer"],
                    "Choice": similarity["choice"],
                    "Score": similarity["score"],
                }
                return result
            except Exception as e:
                return {
                    "Question": pair["question"],
                    "Model_Response": "Error",
                    "Expected_Answer": pair["answer"],
                    "Choice": f"Error: {str(e)}",
                    "Score": 0,
                }

    tasks = [process_single_question(pair) for pair in jsonl_data]
    results = []

    for i, task in enumerate(asyncio.as_completed(tasks), 1):
        result = await task
        results.append(result)
        results_df = pd.DataFrame(results)

        progress_bar.progress(i / total)
        table_container.table(results_df)

    summary = calculate_summary(results_df)
    display_summary_charts(results_df, summary)

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

def calculate_summary(results_df: pd.DataFrame) -> Dict[str, any]:
    accuracy = (results_df["Score"] == 1).mean() * 100
    choice_distribution = results_df["Choice"].value_counts(normalize=True) * 100
    avg_score = results_df["Score"].mean()
    total_questions = len(results_df)
    num_errors = int(results_df["Model_Response"].eq("Error").sum())

    summary = {
        "Total Questions": total_questions,
        "Accuracy (%)": accuracy,
        "Average Score": avg_score,
        "Number of Errors": num_errors,
        "Choice Distribution (%)": choice_distribution.round(2).to_dict(),
    }
    return summary

def display_summary_charts(results_df: pd.DataFrame, summary: Dict[str, any]) -> None:
    col1, col2 = st.columns(2)

    with col1:
        st.write("### Accuracy Percentage")
        st.metric(label="Accuracy (%)", value=f"{summary['Accuracy (%)']:.2f}%")

        st.write("### Average Score")
        st.metric(label="Average Score", value=f"{summary['Average Score']:.2f}")

        st.write("### Result Summary")
        st.json(summary)

    with col2:
        choice_counts = results_df["Choice"].value_counts()
        st.pyplot(generate_pie_chart(choice_counts, "Choice Distribution"))



def generate_pie_chart(data, title: str) -> plt.Figure:
    fig, ax = plt.subplots()
    ax.pie(data, labels=data.index, autopct="%1.1f%%", startangle=90)
    ax.set_title(title)
    return fig

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
        "Select Model", ["gpt-4o-mini", "gpt-4o"]
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
            st.session_state.df = pd.read_csv(uploaded_file, encoding="ISO-8859-1")
            st.session_state.processed = True

        elif file_extension == "pdf":
            pdf_path = f"/tmp/{uploaded_file.name}"

            with open(pdf_path, "wb") as f:
                f.write(uploaded_file.getbuffer())

            qa_tables = process_pdf_in_parallel(
                pdf_path,
                batch_size=batch_size,
                max_workers=max_workers,
                model=model,
                client=client,
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
                    edited_df.to_dict("records"),
                    context=context,
                    client=client,
                    model=model,
                )
            )

if __name__ == "__main__":
    main()
