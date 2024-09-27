import logging
from typing import Dict, Tuple, Any
from concurrent.futures import ThreadPoolExecutor, as_completed
import torch
import numpy as np
from numpy import floating
from tabulate import tabulate
from sentence_transformers import SentenceTransformer
from transformers import (
    GPT2Tokenizer,
    GPT2LMHeadModel,
    DistilBertTokenizer,
    DistilBertModel,
)
from rouge_metric import PyRouge
from sklearn.metrics.pairwise import cosine_similarity
from nltk.tokenize import word_tokenize
from nltk.translate.bleu_score import sentence_bleu, SmoothingFunction
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import f1_score, recall_score

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


class ModelManager:
    def __init__(self) -> None:
        self.sentence_transformer = SentenceTransformer("all-mpnet-base-v2")
        self.gpt2_tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
        self.gpt2_model = GPT2LMHeadModel.from_pretrained("gpt2")
        self.rouge_scorer = PyRouge(rouge_n=(1, 2, 4), rouge_l=True, rouge_w=True)
        self.distilbert_tokenizer = DistilBertTokenizer.from_pretrained(
            "distilbert-base-uncased"
        )
        self.distilbert_model = DistilBertModel.from_pretrained(
            "distilbert-base-uncased"
        )


def compute_semantic_relatedness(
    question: str, ground_truth: str, output: str
) -> float:
    try:
        vectorizer = TfidfVectorizer()
        X = vectorizer.fit_transform([question, ground_truth, output])
        return float(cosine_similarity(X[0], X[1:3]).mean())
    except Exception as e:
        logger.error(f"Error in compute_semantic_relatedness: {e}")
        return 0.0


def compute_bert_score(reference: str, candidate: str) -> float:
    try:
        from bert_score import score

        _, _, F1 = score([candidate], [reference], lang="en", verbose=True)
        return float(F1.mean().item())
    except Exception as e:
        logger.error(f"Error in compute_bert_score: {e}")
        return 0.0


def compute_token_based_metrics(
    ground_truth: str, generated_output: str
) -> Tuple[float, float]:
    ground_truth_tokens = ground_truth.split()
    generated_output_tokens = generated_output.split()

    min_len = min(len(ground_truth_tokens), len(generated_output_tokens))
    ground_truth_tokens = ground_truth_tokens[:min_len]
    generated_output_tokens = generated_output_tokens[:min_len]

    f1 = f1_score(
        ground_truth_tokens,
        generated_output_tokens,
        average="weighted",
        zero_division=0,
    )
    recall = recall_score(
        ground_truth_tokens,
        generated_output_tokens,
        average="weighted",
        zero_division=0,
    )

    return f1, recall


class MetricsCalculator:
    def __init__(self, model_manager: ModelManager) -> None:
        self.model_manager = model_manager

    def compute_similarity(self, text1: str, text2: str) -> float:
        embeddings = self.model_manager.sentence_transformer.encode([text1, text2])
        return float(cosine_similarity([embeddings[0]], [embeddings[1]])[0][0])

    @staticmethod
    def compute_bleu(reference: str, candidate: str) -> float:
        try:
            return sentence_bleu(
                [reference.split()],
                candidate.split(),
                smoothing_function=SmoothingFunction().method1,
            )
        except Exception as e:
            logger.error(f"Error in compute_bleu: {e}")
            return 0.0

    def compute_rouge(self, reference: str, candidate: str) -> float:
        try:
            scores = self.model_manager.rouge_scorer.evaluate([candidate], [reference])
            return scores["rouge-l"]["f"]
        except Exception as e:
            logger.error(f"Error in compute_rouge: {e}")
            return 0.0

    def compute_perplexity(self, text: str) -> float:
        try:
            inputs = self.model_manager.gpt2_tokenizer(text, return_tensors="pt")
            with torch.no_grad():
                outputs = self.model_manager.gpt2_model(
                    **inputs, labels=inputs["input_ids"]
                )
                loss = outputs.loss
            return float(torch.exp(loss).item())
        except Exception as e:
            logger.error(f"Error in compute_perplexity: {e}")
            return float("inf")

    def compute_coherence(self, text: str) -> float | floating[Any]:
        try:
            tokens = word_tokenize(text)
            embeddings = [
                self.model_manager.distilbert_model(
                    **self.model_manager.distilbert_tokenizer(
                        token, return_tensors="pt"
                    )
                )
                .last_hidden_state.mean(dim=1)
                .squeeze()
                .detach()
                .numpy()
                for token in tokens
            ]
            if len(embeddings) < 2:
                return 0.0
            pairwise_similarities = [
                cosine_similarity([embeddings[i]], [embeddings[i + 1]])[0][0]
                for i in range(len(embeddings) - 1)
            ]
            return np.mean(pairwise_similarities)
        except Exception as e:
            logger.error(f"Error in compute_coherence: {e}")
            return 0.0

    @staticmethod
    def compute_factual_accuracy(
        output: str, question: str, ground_truth: str
    ) -> float:
        try:
            keywords = set(question.split() + ground_truth.split())
            output_words = set(output.split())
            return (
                len(keywords.intersection(output_words)) / len(keywords)
                if keywords
                else 0.0
            )
        except Exception as e:
            logger.error(f"Error in compute_factual_accuracy: {e}")
            return 0.0

    @staticmethod
    def compute_lexical_diversity(text: str) -> float:
        words = text.split()
        return len(set(words)) / len(words) if words else 0.0

    def compute_all_metrics(
        self, question: str, ground_truth: str, output: str
    ) -> Dict[str, float]:
        return {
            "cosine_similarity": self.compute_similarity(
                question + ground_truth, output
            ),
            "bleu_score": self.compute_bleu(ground_truth, output),
            "rouge_score": self.compute_rouge(ground_truth, output),
            "perplexity": -self.compute_perplexity(output),
            "coherence": self.compute_coherence(output),
            "bert_score": compute_bert_score(ground_truth, output),
            "semantic_relatedness": compute_semantic_relatedness(
                question, ground_truth, output
            ),
            "factual_accuracy": self.compute_factual_accuracy(
                output, question, ground_truth
            ),
            "lexical_diversity": self.compute_lexical_diversity(output),
            "sentence_length": -len(output.split()),
        }


class Evaluator:
    def __init__(self) -> None:
        logger.info("Initializing Evaluator...")
        self.model_manager = ModelManager()
        self.metrics_calculator = MetricsCalculator(self.model_manager)
        logger.info("Evaluator initialized successfully.")

    def compute_metrics(
        self, question: str, ground_truth: str, output: str
    ) -> Dict[str, float]:
        try:
            return self.metrics_calculator.compute_all_metrics(
                question, ground_truth, output
            )
        except Exception as e:
            logger.error(f"Error in compute_metrics: {e}")
            return {}

    def evaluate_output(
        self, output: str, question: str, ground_truth: str
    ) -> Tuple[str, Dict[str, float]]:
        return output, self.compute_metrics(question, ground_truth, output)

    def hybrid_contextual_evaluation(
        self, question: str, ground_truth: str, generated_output: str
    ) -> Tuple[float, float, float]:
        try:
            generated_outputs = [generated_output]

            with ThreadPoolExecutor() as executor:
                future_to_output = {
                    executor.submit(
                        self.evaluate_output, output, question, ground_truth
                    ): output
                    for output in generated_outputs
                }
                scores = [future.result() for future in as_completed(future_to_output)]

            best_output, best_combined_score = max(
                scores, key=lambda x: sum(x[1].values())
            )

            final_similarity = (
                self.metrics_calculator.compute_similarity(
                    best_output, generated_output
                )
                * 100
            )
            f1, recall = compute_token_based_metrics(ground_truth, generated_output)

            return final_similarity, f1, recall

        except Exception as e:
            logger.error(f"Error in hybrid_contextual_evaluation: {e}")
            return 0.0, 0.0, 0.0


def main() -> None:
    evaluator = Evaluator()
    question = "What is the capital of France?"
    ground_truth = "Paris"
    generated_output = "The capital of France is Paris."

    final_similarity, f1_score, recall_score = evaluator.hybrid_contextual_evaluation(
        question, ground_truth, generated_output
    )
    metrics = evaluator.compute_metrics(question, ground_truth, generated_output)

    combined_metrics = {
        "Final Similarity": final_similarity,
        "F1-Score": f1_score,
        "Recall": recall_score,
        **metrics,
    }

    table_data = [
        [metric.replace("_", " ").title(), f"{score:.2f}"]
        for metric, score in combined_metrics.items()
    ]

    print(tabulate(table_data, headers=["Metric", "Score"], tablefmt="grid"))


if __name__ == "__main__":
    main()
