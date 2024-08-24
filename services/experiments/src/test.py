import os
import openai
from dotenv import load_dotenv
from fuzzywuzzy import fuzz
from tabulate import tabulate

load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

def fuzzy_compare_sentences(sentence1, sentence2):
    lower1, lower2 = sentence1.lower(), sentence2.lower()

    return {
        "Simple ratio": fuzz.ratio(lower1, lower2),
        "Partial ratio": fuzz.partial_ratio(lower1, lower2),
        "Token sort ratio": fuzz.token_sort_ratio(sentence1, sentence2),
        "Token set ratio": fuzz.token_set_ratio(sentence1, sentence2)
    }

def exact_similarity(sentence1, sentence2):
    return sentence1.lower() == sentence2.lower()

def includes_similarity(sentence1, sentence2):
    lower1, lower2 = sentence1.lower(), sentence2.lower()
    return lower1 in lower2 or lower2 in lower1

def llm_compare_sentences(answer1, answer2, question="What is the capital of France?"):
    prompt = (
        f"Compare the following two answers: '{answer1}' and '{answer2}' for the question '{question}'. "
        "Return a JSON object with accuracy and relevance scores, where each score is between 0 and 1."
    )

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
                        "accuracy": {
                            "type": "number"
                        },
                        "relevance": {
                            "type": "number"
                        }
                    },
                    "required": ["accuracy", "relevance"],
                    "additionalProperties": False
                }
            }
        })

    return response.choices[0].message.content

def compare_sentences(x, y, z):
    print(f"\nSentences:\nx: {x}\ny: {y}\nz: {z}")

    results = []
    for pair in [(x, y, "y"), (x, z, "z")]:
        fuzzy_results = fuzzy_compare_sentences(pair[0], pair[1])
        results.append([
            f"x vs {pair[2]}",
            fuzzy_results["Simple ratio"],
            fuzzy_results["Partial ratio"],
            # fuzzy_results["Token sort ratio"],
            # fuzzy_results["Token set ratio"],
            exact_similarity(pair[0], pair[1]),
            includes_similarity(pair[0], pair[1]),
        ])

    headers = ["Comparison", "Simple ratio", "Partial ratio", "Exact Similarity", "Includes Similarity", "LLM Similarity"]
    print(tabulate(results, headers=headers, tablefmt="grid"))

    print("\nLLM Comparison:")
    print(f"x vs y: {llm_compare_sentences(x, y)}")
    print(f"x vs z: {llm_compare_sentences(x, z)}")

if __name__ == '__main__':
    x = "Paris"
    y = "Paris"
    z = "The capital of France is Paris"

    compare_sentences(x, y, z)
