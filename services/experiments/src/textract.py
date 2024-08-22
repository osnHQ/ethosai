import os
import pymupdf
import openai

openai.api_key = os.environ['OPENAI_API_KEY']


def extract_text_from_pdf(pdf_path):
  doc = pymupdf.open(pdf_path)
  return "".join(page.get_text() for page in doc)


def generate_qa_from_text(text, model="gpt-4o-mini"):
  prompt = f"generate factual question answer set from the following text as a table: {text}"
  response = openai.chat.completions.create(
      messages=[{
          "role": "user",
          "content": prompt,
      }],
      model=model,
  )
  return response.choices[0].message.content


if __name__ == "__main__":
  pdf_path = "book.pdf"
  text = extract_text_from_pdf(pdf_path)
  qa_table = generate_qa_from_text(text)
  print(qa_table)
