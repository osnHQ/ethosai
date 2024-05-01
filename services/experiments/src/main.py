import streamlit as st
import pandas as pd
import json

st.title("OpenQA.ai")

uploaded_file = st.file_uploader("Upload a JSONL file", type=["jsonl"])

if uploaded_file is not None:
    jsonl_data = []
    for line in uploaded_file:
        jsonl_data.append(json.loads(line.decode("utf-8")))

    df = pd.json_normalize(jsonl_data)

    st.write(df)
