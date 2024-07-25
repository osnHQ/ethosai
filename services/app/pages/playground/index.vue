<template>
  <div class="bg-dark text-light">
    <div class="bg-gray-900 shadow-xl mx-auto rounded-lg overflow-hidden">
      <div class="flex md:flex-row flex-col">
        <div class="border-dark p-6 border-r hidden">
          <h2 class="mb-4 font-semibold text-xl">Configuration</h2>

          <div class="mb-4">
            <label class="block mb-2 font-medium text-light" for="api">Select API:</label>
            <select id="api" v-model="selectedApi"
              class="border-gray-700 bg-dark text-light p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-600">
              <option value="ollama">Ollama</option>
              <option value="openai">OpenAI</option>
            </select>
          </div>

          <label class="block mb-2 font-medium text-light" for="models">Select Models:</label>
          <select id="models" v-model="selectedModels" multiple
            class="border-gray-700 bg-dark text-light p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-600">
            <option v-for="model in availableModels" :key="model" :value="model">{{ model }}</option>
          </select>

          <button @click="generateAnswers" :disabled="isLoading"
            class="bg-dark-300 hover:bg-dark-500 disabled:opacity-50 mt-4 px-4 py-2 rounded-full w-full font-bold text-light focus:outline-none">
            <span v-if="isLoading" class="flex justify-center items-center">
              <span class="animate-spin mr-2">⏳</span>
              Generating...
            </span>
            <span v-else>
              <span>📝</span>
              Generate Answers
            </span>
          </button>

          <div class="mt-6 flex justify-between items-center p-4 bg-dark-800 rounded-full shadow-md">
            <button @click="exportData"
              class="flex-1 mx-2 bg-dark-300 hover:bg-dark-500 px-4 py-2 rounded-full font-bold text-light focus:outline-none transition-all duration-200">
              <span class="mr-2">📤</span>
              Export
            </button>
            <label for="file-upload"
              class="flex-1 font-bold text-center mx-2 cursor-pointer bg-dark-300 hover:bg-dark-500 px-4 py-2 rounded-full text-light transition-all duration-200">
              <span class="mr-2">📥</span>
              Import
              <input id="file-upload" type="file" @change="importData" accept=".json" class="hidden" />
            </label>
          </div>
        </div>

        <div class="p-6  min-w-full">
          <div class="flex justify-between items-center mb-4">
            <input v-model="filter" type="text" placeholder="Filter questions and answers..."
              class="border-gray-700 bg-gray-800 text-light p-2 border rounded-md w-64" />
            <select v-model="pageSize"
              class="border-gray-700 bg-gray-800 text-light p-2 border rounded-md focus:ring-2 focus:ring-blue-600">
              <option :value="5">5 per page</option>
              <option :value="10">10 per page</option>
              <option :value="20">20 per page</option>
            </select>
          </div>

          <div class="overflow-x-auto rounded-lg">
            <table class="border-dark bg-gray-800 border min-w-full">
              <thead>
                <tr class="bg-gray-700">
                  <th v-for="header in tableHeaders" :key="header.key"
                    class="px-4 py-2 font-medium text-gray-300 text-left text-xs uppercase tracking-wider cursor-pointer"
                    @click="sort(header.key)">
                    {{ header.label }}
                    <span v-if="sortKey === header.key">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(qa, index) in paginatedQaData" :key="index" class="hover:bg-gray-900 transition-all duration-300">
                  <td class="px-4 py-2 text-gray-300 text-sm">{{ qa.question }}</td>
                  <td class="px-4 py-2 text-gray-300 text-sm">{{ qa.answer }}</td>
                  <td v-for="model in selectedModels" :key="model" class="px-4 py-2 text-gray-300 text-sm">
                    {{ qa[model.replace(/[^a-zA-Z0-9]/g, '_')]?.generatedAnswer || '⏳' }}
                  </td>
                  <td v-for="model in selectedModels" :key="`${model}-score`" class="px-4 py-2 text-gray-300 text-sm">
                    <span :class="getSimilarityScoreClass(qa[model.replace(/[^a-zA-Z0-9]/g, '_')]?.similarityScore)">
                      {{ qa[model.replace(/[^a-zA-Z0-9]/g, '_')]?.similarityScore?.toFixed(2) || '⏳' }}
                    </span>
                  </td>

                  <td class="px-4 py-2 text-gray-300 text-sm">
                    <span :class="getStatusClass(qa.status)">{{ qa.status }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex justify-between items-center mt-4">
            <p class="text-gray-400 text-sm">
              Showing {{ currentPage * pageSize + 1 }} to {{ Math.min((currentPage + 1) * pageSize,
                filteredQaData.length) }} of {{ filteredQaData.length }} entries
            </p>
            <div v-if="filteredQaData.length > pageSize">
              <button @click="prevPage" :disabled="currentPage === 0"
                class="bg-gray-700 hover:bg-gray-500 cursor-pointer disabled:opacity-50 focus:shadow-outline px-4 py-2 rounded-l text-light focus:outline-none mr-1">
                Previous
              </button>
              <button @click="nextPage" :disabled="currentPage >= Math.ceil(filteredQaData.length / pageSize) - 1"
                class="bg-gray-700 hover:bg-gray-500 cursor-pointer disabled:opacity-50 focus:shadow-outline px-4 py-2 rounded-r text-light focus:outline-none">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import OpenAI from 'openai';
import ollama from 'ollama/browser';

interface QA {
  question: string;
  answer: string;
  status: string;
  [key: string]: any;
}

type Vector = number[];

const sampleQA = ref<QA[]>([
  { question: "Who wrote the novel '1984'?", answer: "George Orwell", status: "⏳" },
  { question: "What is the chemical symbol for gold?", answer: "Au", status: "⏳" },
  { question: "What is the capital of France?", answer: "Paris", status: "⏳" },
  { question: "Who painted the Mona Lisa?", answer: "Leonardo da Vinci", status: "⏳" },
  { question: "What is the largest planet in our solar system?", answer: "Jupiter", status: "⏳" },
  { question: "What is the smallest prime number?", answer: "2", status: "⏳" },
  { question: "What year did the Titanic sink?", answer: "1912", status: "⏳" },
  { question: "What is the longest river in the world?", answer: "Nile River", status: "⏳" },
  { question: "What element does 'O' represent on the periodic table?", answer: "Oxygen", status: "⏳" },
  { question: "Who is known as the father of modern physics?", answer: "Albert Einstein", status: "⏳" },
  { question: "What is the boiling point of water in Celsius?", answer: "100°C", status: "⏳" },
  { question: "What planet is known as the Red Planet?", answer: "Mars", status: "⏳" }
]);

const similarity = (x: Vector, y: Vector, precision: number = 10): number => {
  const dot = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const magX = Math.sqrt(x.reduce((sum, xi) => sum + xi * xi, 0));
  const magY = Math.sqrt(y.reduce((sum, yi) => sum + yi * yi, 0));

  const sim = magX && magY ? dot / (magX * magY) : 0;
  return parseFloat(sim.toFixed(precision));
};

const generateEmbedding = async (model: string, prompt: string): Promise<Vector> => {
  const response = await ollama.embeddings({ model, prompt });
  return response.embedding;
};

const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

const fetchAnswerFromOpenAI = async (model: string, question: string) => {
  const openai = new OpenAI({ apiKey: openaiApiKey, dangerouslyAllowBrowser: true });

  const response = await openai.chat.completions.create({
    model,
    messages: [{ role: 'user', content: `reply with one or two words only. ${question}` }]
  });

  return response.choices[0].message.content?.replace(/\.$/, "");
};

const fetchAnswerFromOllama = async (model: string, question: string) => {
  const { response } = await ollama.generate({
    model,
    stream: false,
    prompt: `reply with one or two words only. ${question}`
  });

  return response.replace(/\.$/, "");
};

const generateAnswersForQA = async (qa: { [x: string]: any; question: string; answer: string; status: string; }, api: string, models: any[]) => {
  const promises = models.map(async (model) => {
    const modelKey = model.replace(/[^a-zA-Z0-9]/g, '_');

    let generatedAnswer;
    if (api === 'openai') {
      generatedAnswer = await fetchAnswerFromOpenAI(model, qa.question);
    } else if (api === 'ollama') {
      generatedAnswer = await fetchAnswerFromOllama(model, qa.question);
    }

    qa[modelKey] = {
      generatedAnswer,
      similarityScore: null
    };
    qa.status = '✅';
  });

  await Promise.all(promises);
};

const calculateSimilarityScoresForQA = async (qa: { [x: string]: any; question: string; answer: string; status: string; }, models: any[]) => {
  const promises = models.map(async (model) => {
    const modelKey = model.replace(/[^a-zA-Z0-9]/g, '_');
    const generatedAnswer = qa[modelKey]?.generatedAnswer;
    const embeddingModel = 'nomic-embed-text';

    if (generatedAnswer) {
      const [answerEmbedding, generatedEmbedding] = await Promise.all([
        generateEmbedding(embeddingModel, qa.answer),
        generateEmbedding(embeddingModel, generatedAnswer)
      ]);

      qa[modelKey].similarityScore = similarity(answerEmbedding, generatedEmbedding);
    }
  });

  await Promise.all(promises);
};

const generateAnswers = async () => {
  isLoading.value = true;
  try {
    const api = selectedApi.value;

    await Promise.all(sampleQA.value.map(qa => generateAnswersForQA(qa, api, selectedModels.value)));
    await Promise.all(sampleQA.value.map(qa => calculateSimilarityScoresForQA(qa, selectedModels.value)));

    qaData.value = [...sampleQA.value];
  } catch (error) {
    console.error('Error generating answers:', error);
  } finally {
    isLoading.value = false;
    calculateAverageSimilarityScore();
  }
};


const calculateAverageSimilarityScore = () => {
  const totalScores = selectedModels.value.reduce((total, model) => {
    const modelKey = model.replace(/[^a-zA-Z0-9]/g, '_');
    const scores = qaData.value.map(qa => qa[modelKey]?.similarityScore || 0);
    return total + scores.reduce((sum, score) => sum + score, 0);
  }, 0);

  const numberOfScores = selectedModels.value.length * qaData.value.length;
  averageSimilarityScore.value = numberOfScores ? totalScores / numberOfScores : 0;
};

const generateBatchQAPairs = async () => {
  if (!batchTopics.value.trim()) {
    alert("Please enter topics for batch generation.");
    return;
  }

  isGeneratingBatch.value = true;

  try {
    const topics = batchTopics.value.split(',').map(topic => topic.trim());


    const newQAPairs = await Promise.all(topics.map(async (topic) => {

      const questionResponse = await ollama.chat({
        model: selectedModels.value[0],
        messages: [{ role: "user", content: `Generate a concise question about ${topic}.` }],
      });
      const newQuestion = questionResponse.message.content.trim();


      const answerResponse = await ollama.chat({
        model: selectedModels.value[0],
        messages: [
          { role: "user", content: `Answer the following question in one or two words only: ${newQuestion}` },
        ],
      });
      const newAnswer = answerResponse.message.content.trim();

      return { question: newQuestion, answer: newAnswer, status: "⏳" };
    }));


    sampleQA.value.push(...newQAPairs);
    qaData.value = [...sampleQA.value];

    await generateAnswers();

    calculateAverageSimilarityScore();

    batchTopics.value = '';
  } catch (error) {
    console.error("Error generating batch QA pairs:", error);
    alert("An error occurred while generating batch QA pairs. Please try again.");
  } finally {
    isGeneratingBatch.value = false;
  }
};


const exportData = () => {
  const blob = new Blob([JSON.stringify(qaData.value, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'qa-data.json';
  link.click();
  URL.revokeObjectURL(url);
};

const readFileContent = async (file: File): Promise<string> => {
  return await file.text();
};

const parseAndValidateData = (text: string): { question: string; answer: string }[] => {
  const importedData = JSON.parse(text) as { question: string; answer: string }[];

  if (!Array.isArray(importedData) || !importedData.every(item => item.question && item.answer)) {
    throw new Error("Invalid data format.");
  }

  return importedData;
};

const updateStateWithImportedData = (data: { question: string; answer: string }[]) => {
  sampleQA.value = data.map(item => ({
    question: item.question,
    answer: item.answer,
    status: '⏳'
  }));
  qaData.value = [...sampleQA.value];
  calculateAverageSimilarityScore();
};

const importData = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    const file = input.files[0];

    try {
      const text = await readFileContent(file);
      const importedData = parseAndValidateData(text);
      updateStateWithImportedData(importedData);

    } catch (error) {
      console.error("Error importing data:", error);
      alert("An error occurred while importing data. Please make sure the file is correctly formatted.");
    }
  }
};


const sort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value -= 1;
  }
};

const nextPage = () => {
  if (currentPage.value < Math.ceil(filteredQaData.value.length / pageSize.value) - 1) {
    currentPage.value += 1;
  }
};

const getSimilarityScoreClass = (score: number) => {
  if (score > 0.8) return 'text-green-500';
  if (score > 0.5) return 'text-yellow-500';
  return 'text-red-500';
};

const getStatusClass = (status: string) => {
  return status === '⏳' ? 'text-dark-500' : 'text-blue-500';
};

const selectedApi = ref('openai');
const availableModels = computed(() => {
  return selectedApi.value === 'ollama'
    ? ['qwen2:0.5b', 'qwen2:1.5b', 'tinyllama:1.1b']
    : ['gpt-4o-mini'];
});

const selectedModels = ref<string[]>(['gpt-4o-mini']);
const batchTopics = ref('');
const filter = ref('');
const pageSize = ref(20);
const currentPage = ref(0);
const isLoading = ref(false);
const isGeneratingBatch = ref(false);

const qaData = ref<QA[]>(sampleQA.value);
const averageSimilarityScore = ref(0);

const tableHeaders = computed(() => [
  { key: 'question', label: 'Question' },
  { key: 'answer', label: 'Answer' },
  ...selectedModels.value.map(model => ({ key: model, label: model })),
  ...selectedModels.value.map(model => ({ key: `${model}-score`, label: `${model} Score` })),
  { key: 'status', label: 'Status' }
]);

const sortKey = ref('question');
const sortOrder = ref('asc');

const sortedQaData = computed(() => {
  return [...qaData.value].sort((a, b) => {
    const compareA = a[sortKey.value] || '';
    const compareB = b[sortKey.value] || '';
    if (sortOrder.value === 'asc') {
      return compareA > compareB ? 1 : compareA < compareB ? -1 : 0;
    } else {
      return compareA < compareB ? 1 : compareA > compareB ? -1 : 0;
    }
  });
});

const filteredQaData = computed(() => {
  return sortedQaData.value.filter(qa =>
  (qa.question.toLowerCase().includes(filter.value.toLowerCase()) ||
    qa.answer.toLowerCase().includes(filter.value.toLowerCase()))
  );
});

const paginatedQaData = computed(() => {
  const start = currentPage.value * pageSize.value;
  const end = start + pageSize.value;
  return filteredQaData.value.slice(start, end);
});

watch(selectedModels, (newModels) => {
  if (newModels.length === 0) return;


  sampleQA.value.forEach(qa => {
    newModels.forEach(model => {
      const modelKey = model.replace(/[^a-zA-Z0-9]/g, '_');
      qa[modelKey] = {
        generatedAnswer: null,
        similarityScore: null
      };
    });
  });


  qaData.value = [...sampleQA.value];
});

const props = defineProps(['data', 'model']);

onMounted(() => {
  const model = props.model || 'gpt-4o-mini';
  selectedModels.value = [model];
  if (props.data) {
    const data = parseAndValidateData(props.data);
    updateStateWithImportedData(data);
    generateAnswers();
  }
});
</script>