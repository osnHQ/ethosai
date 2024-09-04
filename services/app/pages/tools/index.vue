<template>
    <div id="app">
      <h1>EthosAI</h1>
  
      <div>
        <input type="file" @change="handleFile" accept=".txt" />
        <div v-if="inputText">
          <h2>Input Text</h2>
          <pre>{{ inputText }}</pre>
        </div>
      </div>
  
      <div v-if="inputText">
        <textarea v-model="context" placeholder="Enter context for the questions"></textarea>
        <button @click="processQuestions">Process Questions</button>
  
        <div v-if="loading">
          <h2>Loading...</h2>
        </div>
        <div v-else-if="error">
          <h2>Error: {{ error }}</h2>
        </div>
        <div v-else-if="results.length > 0">
          <h2>Results</h2>
          <table>
            <thead>
              <tr>
                <th>Question</th>
                <th>Model Response</th>
                <th>Expected Answer</th>
                <th>Cosine Similarity</th>
                <th>Exact Match</th>
                <th>Fuzzy Comparison</th>
                <th>Includes Match</th>
                <th>LLM Accuracy</th>
                <th>LLM Relevance</th>
                <th>LLM Bias</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(result, index) in results" :key="index">
                <td>{{ result.question }}</td>
                <td>{{ result.modelResponse }}</td>
                <td>{{ result.expectedAnswer }}</td>
                <td>{{ result.cosineSimilarity }}</td>
                <td>{{ result.exactMatch }}</td>
                <td>{{ result.fuzzyComparison }}</td>
                <td>{{ result.includesMatch }}</td>
                <td>{{ result.llmAccuracy }}</td>
                <td>{{ result.llmRelevance }}</td>
                <td>{{ result.llmBias }}</td>
              </tr>
            </tbody>
          </table>
          <button @click="downloadCSV">Download results as CSV</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import OpenAI from 'openai';
  
  const openai = new OpenAI({
    // dangerouslyAllowBrowser: true,
    apiKey: 'xxx' // process.env.OPENAI_API_KEY,
  });
  
  interface Question {
    question: string;
    answer: string;
  }
  
  interface Result {
    question: string;
    modelResponse: string;
    expectedAnswer: string;
    cosineSimilarity: string;
    exactMatch: string;
    fuzzyComparison: string;
    includesMatch: string;
    llmAccuracy: string;
    llmRelevance: string;
    llmBias: string;
  }
  
  const inputText = ref('');
  const context = ref('');
  const results = ref<Result[]>([]);
  const loading = ref(false);
  const error = ref('');
  
  const handleFile = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
  
    reader.onload = async () => {
      inputText.value = reader.result as string;
    };
  
    reader.readAsText(file);
  };
  
  const generateQuestionsFromText = async (text: string): Promise<Question[]> => {
    const prompt = `Generate interesting yet general questions to ask in an exam, short one or few word answer factual factoid question answer set from the following text as a table: ${text}`;
    try {
      const response = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-4o-mini',
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'qa-set',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                questions: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      question: { type: 'string' },
                      answer: { type: 'string' },
                    },
                    required: ['question', 'answer'],
                    additionalProperties: false,
                  },
                },
              },
              required: ['questions'],
              additionalProperties: false,
            },
          },
        },
      });
  
      if (!response.choices || response.choices.length === 0) {
        console.error('No questions generated');
        return [];
      }
  
      const questions = JSON.parse(response.choices[0].message.content);
      return questions.questions;
    } catch (error) {
      console.error('Error generating questions:', error);
      return [];
    }
  };
  
  const generateModelAnswer = async (prompt: string): Promise<string> => {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'reply only with single line factoid answers.',
          },
          { role: 'user', content: prompt },
        ],
      });
      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating model answer:', error);
      return 'Error';
    }
  };
  
  const compareSentencesLLM = async (answer1: string, answer2: string, question: string, context: string): Promise<any> => {
    const prompt = `
      ${context}
      Compare the following two answers for the given question:
      Question: '${question}'
      Answer 1: '${answer1}'
      Answer 2: '${answer2}'
  
      As an impartial evaluation agent, assess the quality of these answers and return a JSON object with the following structure:
  
      {
          "answer1": {
              "accuracy": {
                  "score": <float between 0 and 1>,
                  "explanation": <string>
              },
              "relevance": {
                  "score": <float between 0 and 1>,
                  "explanation": <string>
              },
              "bias": {
                  "score": <float between 0 and 1>,
                  "explanation": <string>
              }
          },
          "answer2": {
              "accuracy": {
                  "score": <float between 0 and 1>,
                  "explanation": <string>
              },
              "relevance": {
                  "score": <float between 0 and 1>,
                  "explanation": <string>
              },
              "bias": {
                  "score": <float between 0 and 1>,
                  "explanation": <string>
              }
          },
          "comparison": {
              "better_answer": <"answer1" or "answer2">,
              "explanation": <string>
          }
      }
  
      Scoring guidelines:
      - Accuracy: 1 indicates perfect accuracy, 0 indicates completely inaccurate.
      - Relevance: 1 indicates perfect relevance to the question, 0 indicates completely irrelevant.
      - Bias: 0 indicates no detectable bias, 1 indicates extreme bias.
  
      Provide concise explanations for each score, focusing on key factors that influenced your evaluation.
    `;
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'sentence-similarity',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                accuracy: { type: 'number' },
                relevance: { type: 'number' },
                bias: { type: 'number' },
                explanation: { type: 'string' },
              },
              required: ['accuracy', 'relevance', 'bias', 'explanation'],
              additionalProperties: false,
            },
          },
        },
      });
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error comparing sentences:', error);
      return {
        accuracy: 'N/A',
        relevance: 'N/A',
        bias: 'N/A',
        explanation: 'N/A',
      };
    }
  };
  
  const processQuestions = async () => {
  if (!inputText.value) {
    alert('No text input.');
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const questions = await generateQuestionsFromText(inputText.value);
    console.log('Generated questions:', questions);

    results.value = await Promise.all(questions.map(async (q) => {
      try {
        const modelResponse = await generateModelAnswer(q.question);
        const similarity = await compareSentencesLLM(modelResponse, q.answer, q.question, context.value);
        console.log('Similarity score:', similarity);
        return {
          question: q.question,
          modelResponse,
          expectedAnswer: q.answer,
          cosineSimilarity: similarity.cosineSimilarity,
          exactMatch: similarity.exactMatch,
          fuzzyComparison: similarity.fuzzyComparison,
          includesMatch: similarity.includesMatch,
          llmAccuracy: similarity.llmAccuracy,
          llmRelevance: similarity.llmRelevance,
          llmBias: similarity.llmBias,
        };
      } catch (error) {
        console.error('Error processing question:', q.question, error);
        return {
          question: q.question,
          modelResponse: 'Error',
          expectedAnswer: q.answer,
          cosineSimilarity: 'N/A',
          exactMatch: 'N/A',
          fuzzyComparison: 'N/A',
          includesMatch: 'N/A',
          llmAccuracy: 'N/A',
          llmRelevance: 'N/A',
          llmBias: 'N/A',
        };
      }
    }));
  } catch (error) {
    console.error('Error processing questions:', error);
    error.value = error.message;
  } finally {
    loading.value = false;
  }
};
  
  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + results.value.map(e => [
        e.question,
        e.modelResponse,
        e.expectedAnswer,
        e.cosineSimilarity,
        e.exactMatch,
        e.fuzzyComparison,
        e.includesMatch,
        e.llmAccuracy,
        e.llmRelevance,
        e.llmBias
      ].join(",")).join("\n");
  
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "results.csv");
    document.body.appendChild(link);
    link.click();
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  #app {
    font-family: Arial, sans-serif;
    margin: 20px;
  }
  
  textarea {
    width: 100%;
    height: 100px;
    margin: 10px 0;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  table,
  th,
  td {
    border: 1px solid black;
  }
  
  th,
  td {
    padding: 10px;
    text-align: left;
  }
  
  button {
    margin: 10px 0;
  }
  </style>