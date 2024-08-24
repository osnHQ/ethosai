import concurrent.futures
import os
import json
import csv
import openai
import pymupdf
from functools import partial

openai.api_key = os.environ['OPENAI_API_KEY']


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


def process_pdf_in_parallel(pdf_path,
                            batch_size=5,
                            max_workers=5,
                            model="gpt-4o-mini"):
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


def save_to_md(qa_tables, output_file):
    with open(output_file, 'w', encoding='utf-8') as mdfile:
        mdfile.write("| Question | Answer |\n|----------|--------|\n")
        for table in qa_tables:
            qa_dict = json.loads(table)
            for qa in qa_dict['questions']:
                question = qa['question'].replace('|', '\\|')
                answer = qa['answer'].replace('|', '\\|')
                mdfile.write(f"| {question} | {answer} |\n")


def save_to_csv(qa_tables, output_file):
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['question', 'answer'])
        for table in qa_tables:
            qa_dict = json.loads(table)
            for qa in qa_dict['questions']:
                writer.writerow([qa['question'], qa['answer']])


def save_to_jsonl(qa_tables, output_file):
    with open(output_file, 'w', encoding='utf-8') as jsonlfile:
        for table in qa_tables:
            qa_dict = json.loads(table)
            for qa in qa_dict['questions']:
                jsonlfile.write(json.dumps(qa) + '\n')


def main(pdf_path,
         output_prefix,
         batch_size=5,
         max_workers=5,
         model="gpt-4o-mini"):
    qa_tables = process_pdf_in_parallel(pdf_path, batch_size, max_workers,
                                        model)

    save_to_md(qa_tables, f"{output_prefix}.md")
    save_to_csv(qa_tables, f"{output_prefix}.csv")
    save_to_jsonl(qa_tables, f"{output_prefix}.jsonl")

    print(
        f"Q&A tables saved to {output_prefix}.md, {output_prefix}.csv, and {output_prefix}.jsonl"
    )


if __name__ == "__main__":
    main("book.pdf", "output")