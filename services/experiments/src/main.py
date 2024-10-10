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
import plotly.express as px

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.FileHandler("app.log"), logging.StreamHandler()],
)
logger = logging.getLogger(__name__)

st.set_page_config(
    page_title="📊 EthosAI Dashboard",
    layout="wide",
    initial_sidebar_state="expanded",
    menu_items={
        'About': "# EthosAI Dashboard\nA powerful tool to generate and analyze Q&A sets from PDF and CSV files using OpenAI's API."
    }
)

def initialize_session_state() -> None:
    if "df" not in st.session_state:
        st.session_state.df = pd.DataFrame(columns=["question", "answer"])
    if "processed" not in st.session_state:
        st.session_state.processed = False
    if "results_df" not in st.session_state:
        st.session_state.results_df = pd.DataFrame()
    if "summary" not in st.session_state:
        st.session_state.summary = {}
    if "log" not in st.session_state:
        st.session_state.log = []
    if "current_question" not in st.session_state:
        st.session_state.current_question = ""
    if "show_logs" not in st.session_state:
        st.session_state.show_logs = False

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
        st.session_state.log.append(f"Error generating QA from text: {e}")
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

        for i, future in enumerate(concurrent.futures.as_completed(futures), 1):
            result = future.result()
            results.append(result)
            progress_bar.progress(i / total_batches)
            st.session_state.log.append(f"Completed batch {i}/{total_batches}")

    return results

async def generate_model_answer(
    prompt: str, client: AsyncOpenAI, model: str = "gpt-4o-mini", system_prompt: str = "Reply with a one or few words short factoid answer."
) -> str:
    try:
        response = await client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {"role": "user", "content": prompt},
            ],
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"Error generating model answer: {e}")
        st.session_state.log.append(f"Error generating model answer: {e}")
        return ""

async def compare_sentences_llm(
    model_answer: str,
    expert_answer: str,
    question: str,
    context: str = "",
    client: AsyncOpenAI = None,
    model: str = "gpt-4o-mini",
) -> Dict[str, any]:
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

  Return the answer as a JSON object with the following structure:
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
        response_content = response.choices[0].message.content
        return json.loads(response_content)
    except Exception as e:
        logger.error(f"Error comparing sentences with LLM: {e}")
        st.session_state.log.append(f"Error comparing sentences with LLM: {e}")
        return {
            "choice": f"error: {str(e)}",
            "score": 0,
        }

def save_qa_to_jsonl(qa_tables: List[str], output_file: Path) -> None:
    with open(output_file, "w", encoding="utf-8") as jsonlfile:
        for table in qa_tables:
            try:
                qa_dict = json.loads(table)
                for qa in qa_dict["questions"]:
                    jsonlfile.write(json.dumps(qa) + "\n")
            except Exception as e:
                logger.error(f"Error saving QA to JSONL: {e}")
                st.session_state.log.append(f"Error saving QA to JSONL: {e}")
                continue

def load_jsonl(file) -> List[Dict[str, str]]:
    return [json.loads(line.decode("utf-8")) for line in file]

async def process_questions(
    jsonl_data: List[Dict[str, str]],
    context: str = "",
    client=None,
    model: str = "gpt-4o-mini",
    system_prompt: str = "Reply with a one or few words short factoid answer."
) -> None:
    columns = ["Question", "Model_Response", "Expected_Answer", "Choice", "Score"]
    results_df = pd.DataFrame(columns=columns)

    progress_bar = st.progress(0)
    table_container = st.empty()
    current_question_placeholder = st.empty()
    total = len(jsonl_data)

    semaphore = asyncio.Semaphore(50)

    async def process_single_question(pair):
        async with semaphore:
            try:
                st.session_state.current_question = pair["question"]
                current_question_placeholder.markdown(f"**Currently Processing:** {pair['question']}")
                response = (
                    await generate_model_answer(
                        f"{context}, {pair['question']}", client, model=model, system_prompt=system_prompt
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
                st.session_state.log.append(f"Processed question: {pair['question']}")
                return result
            except Exception as e:
                st.session_state.log.append(f"Error processing question '{pair['question']}': {e}")
                return {
                    "Question": pair["question"],
                    "Model_Response": "Error",
                    "Expected_Answer": pair["answer"],
                    "Choice": f"Error: {str(e)}",
                    "Score": 0,
                }

    tasks = [process_single_question(pair) for pair in jsonl_data]
    results = []

    try:
        for i, task in enumerate(asyncio.as_completed(tasks), 1):
            result = await task
            results.append(result)
            results_df = pd.DataFrame(results)

            progress_bar.progress(i / total)
            table_container.table(results_df)
    finally:
        st.session_state.current_question = ""
        current_question_placeholder.empty()

    summary = calculate_summary(results_df)
    display_summary_charts(results_df, summary)

    st.session_state.results_df = results_df
    st.session_state.summary = summary

    csv = results_df.to_csv(index=False)
    file_path = f"./results/{uuid4().hex}.csv"
    Path("./results").mkdir(parents=True, exist_ok=True)
    results_df.to_csv(file_path, index=False)

    st.download_button(
        label="📥 Download Results as CSV",
        data=csv,
        file_name="qa_results.csv",
        mime="text/csv",
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
    with st.container():
        st.subheader("📈 Summary Metrics")
        col1, col2, col3, col4 = st.columns(4)
        col1.metric("Total Questions", summary["Total Questions"])
        col2.metric("Accuracy (%)", f"{summary['Accuracy (%)']:.2f}%")
        col3.metric("Average Score", f"{summary['Average Score']:.2f}")
        col4.metric("Number of Errors", summary["Number of Errors"])

    with st.container():
        st.subheader("📊 Choice Distribution")
        choice_counts = results_df["Choice"].value_counts()

        correct_choices = ['B', 'C', 'E']
        incorrect_choices = ['A', 'D']

        correct_count = results_df['Choice'].isin(correct_choices).sum()
        incorrect_count = results_df['Choice'].isin(incorrect_choices).sum()

        total_questions = len(results_df)

        correct_percentage = (correct_count / total_questions) * 100
        incorrect_percentage = (incorrect_count / total_questions) * 100

        labels = ['Correct', 'Incorrect']
        percentages = [correct_percentage, incorrect_percentage]

        fig_correct_incorrect = px.bar(
            x=labels,
            y=percentages,
            labels={'x': 'Answer Type', 'y': 'Percentage'},
            title='Answer type distribution',
            text=[f'{correct_percentage:.2f}%', f'{incorrect_percentage:.2f}%'],
            color=labels,
            color_discrete_map={'Correct': 'green', 'Incorrect': 'red'}
        )
        fig_correct_incorrect.update_traces(textposition='outside')

        col1, col2 = st.columns(2)
        with col1:
            st.plotly_chart(generate_pie_chart(choice_counts, "Choice Distribution"), use_container_width=True)
        with col2:
            st.plotly_chart(fig_correct_incorrect, use_container_width=True)



def generate_pie_chart(data, title: str) -> plt.Figure:
    fig = px.pie(names=data.index, values=data.values, title=title, hole=0.3)
    fig.update_traces(textposition='inside', textinfo='percent+label')
    return fig

def generate_bar_chart(data, title: str) -> plt.Figure:
    fig = px.bar(
        x=data.index,
        y=data.values,
        labels={'x': 'Choice', 'y': 'Percentage'},
        title=title,
        color=data.index
    )
    fig.update_traces(texttemplate='%{y:.2f}%', textposition='auto')
    return fig

@st.cache_resource
def load_api_key() -> str:
    load_dotenv()
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    if OPENAI_API_KEY:
        return OPENAI_API_KEY
    else:
        return ""

def clear_session_state():
    for key in list(st.session_state.keys()):
        del st.session_state[key]
    st.success("Session state cleared. Reloading the app...")
    st.rerun()

def main() -> None:
    st.title("📊 **EthosAI Dashboard**")

    initialize_session_state()

    with st.sidebar:
        st.header("🔧 Configuration")

        OPENAI_API_KEY = load_api_key()

        if OPENAI_API_KEY:
            os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY
        else:
            api_key_input = st.text_input(
                "🔑 Enter your OpenAI API Key", type="password"
            )
            if api_key_input:
                os.environ["OPENAI_API_KEY"] = api_key_input
                st.success("OpenAI API Key has been set.")
            else:
                st.warning("Please enter your OpenAI API key to proceed.")
                st.stop()

        client = AsyncOpenAI(
            api_key=os.environ.get("OPENAI_API_KEY"),
        )

        model = st.selectbox(
            "🛠️ Select Model", ["gpt-4o-mini", "gpt-4o"], index=0
        )
        batch_size = st.slider(
            "📦 Batch Size", min_value=1, max_value=10, value=5, step=1
        )
        max_workers = st.slider(
            "🔧 Max Workers", min_value=1, max_value=50, value=50, step=1
        )
        context = st.text_area(
            "📝 Enter context for the questions",
            height=100,
        )

        system_prompt = st.text_area(
            "📝 Customize System Prompt",
            value="Reply with a one or few words short factoid answer.",
            height=100,
        )

        with st.expander("📁 Additional Settings", expanded=False):
            st.checkbox("Show Live Logs", value=False, key="show_logs")

        st.button("🧹 Clear Session", on_click=clear_session_state)

    st.header("📂 Upload Your File")
    uploaded_file = st.file_uploader(
        "Upload a PDF or CSV file",
        type=["pdf", "csv"],
    )

    if uploaded_file is not None and not st.session_state.processed:
        file_extension = uploaded_file.name.split(".")[-1].lower()

        if file_extension == "csv":
            try:
                st.session_state.df = pd.read_csv(uploaded_file, encoding="ISO-8859-1")
                st.session_state.processed = True
                st.success("✅ CSV file uploaded and processed successfully.")
            except Exception as e:
                st.error(f"❌ Error processing CSV file: {e}")
                logger.error(f"CSV processing error: {e}")
                st.stop()

        elif file_extension == "pdf":
            pdf_path = f"/tmp/{uploaded_file.name}"

            try:
                with open(pdf_path, "wb") as f:
                    f.write(uploaded_file.getbuffer())
                st.info("🔄 Processing PDF file. This may take a few moments...")

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
                st.success("✅ PDF file processed successfully.")
            except Exception as e:
                st.error(f"❌ Error processing PDF file: {e}")
                logger.error(f"PDF processing error: {e}")
                st.stop()

    if st.session_state.processed and not st.session_state.df.empty:
        st.header("✏️ Edit and Review Q&A Data")

        with st.expander("📄 View Data", expanded=True):
            edited_df = st.data_editor(
                st.session_state.df,
                num_rows="dynamic",
            )
        st.download_button(
            label="📥 Download Q&A Data as CSV",
            data=edited_df.to_csv(index=False),
            file_name="qa_data.csv",
            mime="text/csv",
        )

        with st.expander("⚙️ Processing Options", expanded=True):
            if st.button("🔄 Process Questions"):
                with st.spinner("🔄 Processing questions..."):
                    asyncio.run(
                        process_questions(
                            edited_df.to_dict("records"),
                            context=context,
                            client=client,
                            model=model,
                            system_prompt=system_prompt
                        )
                    )

    if not st.session_state.results_df.empty:
        st.header("📝 **Processing Results**")

        tabs = st.tabs(["📋 Detailed Results", "🔍 Search Results"])

        with tabs[0]:
            st.subheader("📋 Detailed Results Table")
            st.dataframe(st.session_state.results_df)

        with tabs[1]:
            st.subheader("🔍 Search Through Results")
            search_query = st.text_input(
                "🔎 Enter a keyword to search questions",
            )
            if search_query:
                filtered_df = st.session_state.results_df[
                    st.session_state.results_df["Question"].str.contains(
                        search_query,
                        case=False,
                        na=False
                    )
                ]
                st.write(f"Found {len(filtered_df)} results for '{search_query}':")
                st.dataframe(filtered_df)
            else:
                st.write("Enter a keyword to search through the questions.")

        st.download_button(
            label="📥 Download Detailed Results as CSV",
            data=st.session_state.results_df.to_csv(index=False),
            file_name="detailed_results.csv",
            mime="text/csv",
        )

    if st.session_state.show_logs and st.session_state.log:
        st.header("📜 **Live Processing Log**")
        log_text = "\n".join(st.session_state.log[-100:])
        st.text_area(
            "Processing Log",
            log_text,
            height=300,
        )

    if st.session_state.current_question:
        st.sidebar.subheader("🔄 Current Task")
        st.sidebar.info(f"**{st.session_state.current_question}**")

    st.markdown(
        """
        ---
        🛠️ Built with [Streamlit](https://streamlit.io/) | © 2024 EthosAI
        """
    )

if __name__ == "__main__":
    main()
