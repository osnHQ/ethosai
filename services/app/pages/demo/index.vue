<template>
  <div class="bg-gray-100 p-8 min-h-screen text-dark">
    <div class="bg-white shadow-xl mx-auto rounded-lg max-w-7xl overflow-hidden">
      <header class="bg-blue-600 p-6 text-white">
        <h1 class="font-bold text-3xl">LLM Evaluation</h1>
      </header>

      <div class="flex md:flex-row flex-col">
        <div class="border-gray-200 p-6 border-r md:w-1/3">
          <h2 class="mb-4 font-semibold text-xl">Configuration</h2>

          <label class="block mb-2 font-medium text-gray-700" for="models">Select Models:</label>
          <select id="models" v-model="selectedModels" multiple
            class="border-gray-300 p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500">
            <option v-for="model in availableModels" :key="model" :value="model">{{ model }}</option>
          </select>

          <button @click="generateAnswers" :disabled="isLoading"
            class="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 focus:shadow-outline mt-4 px-4 py-2 rounded w-full font-bold text-white focus:outline-none">
            <span v-if="isLoading" class="flex justify-center items-center">
              <svg class="mr-3 -ml-1 w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              Generating...
            </span>
            <span v-else>Generate Answers</span>
          </button>

          <div class="mt-6">
            <h3 class="mb-2 font-semibold text-lg">QA Pair Generation</h3>
            <input v-model="batchTopics" type="text" placeholder="Enter topics separated by commas"
              class="border-gray-300 p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500" />
            <button @click="generateBatchQAPairs" :disabled="isGeneratingBatch"
              class="bg-green-500 hover:bg-green-600 disabled:opacity-50 focus:shadow-outline mt-2 px-4 py-2 rounded w-full font-bold text-white focus:outline-none">
              {{ isGeneratingBatch ? 'Generating...' : 'Generate QA Pairs' }}
            </button>
          </div>

          <div class="mt-6">
            <h3 class="mb-2 font-semibold text-lg">Statistics</h3>
            <p>Total QA Pairs: {{ qaData.length }}</p>
            <p>Average Similarity Score: {{ averageSimilarityScore.toFixed(2) }}</p>
          </div>

          <div class="mt-6">
            <h3 class="mb-2 font-semibold text-lg">Export/Import</h3>
            <button @click="exportData"
              class="bg-indigo-500 hover:bg-indigo-600 focus:shadow-outline mt-2 px-4 py-2 rounded w-full font-bold text-white focus:outline-none">
              Export Data
            </button>
            <input type="file" @change="importData" accept=".json" class="mt-2" />
          </div>
        </div>

        <div class="p-6 md:w-2/3">
          <div class="flex justify-between items-center mb-4">
            <input v-model="filter" type="text" placeholder="Filter questions and answers..."
              class="border-gray-300 p-2 border rounded-md w-64 focus:ring-2 focus:ring-blue-500" />
            <select v-model="pageSize" class="border-gray-300 p-2 border rounded-md focus:ring-2 focus:ring-blue-500">
              <option :value="5">5 per page</option>
              <option :value="10">10 per page</option>
              <option :value="20">20 per page</option>
            </select>
          </div>

          <div class="overflow-x-auto">
            <table class="border-gray-200 bg-white border min-w-full">
              <thead>
                <tr class="bg-gray-100">
                  <th v-for="header in tableHeaders" :key="header.key"
                    class="px-4 py-2 font-medium text-gray-500 text-left text-xs uppercase tracking-wider cursor-pointer"
                    @click="sort(header.key)">
                    {{ header.label }}
                    <span v-if="sortKey === header.key">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(qa, index) in paginatedQaData" :key="index" class="hover:bg-gray-50">
                  <td class="px-4 py-2 text-gray-900 text-sm">{{ qa.question }}</td>
                  <td class="px-4 py-2 text-gray-900 text-sm">{{ qa.answer }}</td>
                  <td v-for="model in selectedModels" :key="model" class="px-4 py-2 text-gray-900 text-sm">
                    {{ qa[model]?.generatedAnswer || '⏳' }}
                  </td>
                  <td v-for="model in selectedModels" :key="`${model}-score`" class="px-4 py-2 text-gray-900 text-sm">
                    <span :class="getSimilarityScoreClass(qa[model]?.similarityScore)">
                      {{ qa[model]?.similarityScore?.toFixed(2) || '⏳' }}
                    </span>
                  </td>
                  <td class="px-4 py-2 text-gray-900 text-sm">
                    <span :class="getStatusClass(qa.status)">{{ qa.status }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex justify-between items-center mt-4">
            <p class="text-gray-700 text-sm">
              Showing {{ currentPage * pageSize + 1 }} to {{ Math.min((currentPage + 1) * pageSize,
              filteredQaData.length) }} of {{ filteredQaData.length }} entries
            </p>
            <div>
              <button @click="prevPage" :disabled="currentPage === 0"
                class="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 focus:shadow-outline px-4 py-2 rounded-l font-bold text-white focus:outline-none">
                Previous
              </button>
              <button @click="nextPage" :disabled="currentPage >= Math.ceil(filteredQaData.length / pageSize) - 1"
                class="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 focus:shadow-outline px-4 py-2 rounded-r font-bold text-white focus:outline-none">
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
import ollama from 'ollama';

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
  { question: "Who is the main character in the movie 'Inception'?", answer: "Dom Cobb", status: "⏳" },
  { question: "What is the square root of 64?", answer: "8", status: "⏳" },
  { question: "Who painted the Mona Lisa?", answer: "Leonardo da Vinci", status: "⏳" },
  { question: "What is the largest planet in our solar system?", answer: "Jupiter", status: "⏳" },
  { question: "Who is the author of the theory of general relativity?", answer: "Albert Einstein", status: "⏳" },
  { question: "What is the capital of Australia?", answer: "Canberra", status: "⏳" },
  { question: "Who discovered penicillin?", answer: "Alexander Fleming", status: "⏳" },
  { question: "What is the highest mountain in the world?", answer: "Mount Everest", status: "⏳" }
]);

const availableModels = ref(['qwen2:0.5b', 'qwen2:1.5b', 'tinyllama:1.1b']);
const selectedModels = ref<string[]>(['qwen2:0.5b']);
const isLoading = ref(false);
const filter = ref('');
const sortKey = ref('');
const sortOrder = ref<'asc' | 'desc'>('asc');
const currentPage = ref(0);
const pageSize = ref(5);
const newQuestionTopic = ref('');
const isGeneratingNewQA = ref(false);
const batchTopics = ref('');
const isGeneratingBatch = ref(false);

const generatedAnswers = ref<Record<string, string[]>>({});
const similarityScores = ref<Record<string, number[]>>({});

const qaData = computed(() => {
  return sampleQA.value.map((qa, index) => ({
    ...qa,
    ...selectedModels.value.reduce((acc, model) => {
      acc[model] = {
        generatedAnswer: generatedAnswers.value[model]?.[index] || '',
        similarityScore: similarityScores.value[model]?.[index] || 0
      };
      return acc;
    }, {} as Record<string, { generatedAnswer: string; similarityScore: number }>)
  }));
});

const filteredQaData = computed(() => {
  let filtered = qaData.value.filter(qa =>
    qa.question.toLowerCase().includes(filter.value.toLowerCase()) ||
    qa.answer.toLowerCase().includes(filter.value.toLowerCase())
  );
  if (sortKey.value) {
    filtered.sort((a, b) => {
      let aValue = sortKey.value.includes('Score') ? a[sortKey.value.replace('Score', '')]?.similarityScore : a[sortKey.value];
      let bValue = sortKey.value.includes('Score') ? b[sortKey.value.replace('Score', '')]?.similarityScore : b[sortKey.value];
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder.value === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return sortOrder.value === 'asc' ? String(aValue).localeCompare(String(bValue)) : String(bValue).localeCompare(String(aValue));
    });
  }
  return filtered;
});

const paginatedQaData = computed(() => {
  const start = currentPage.value * pageSize.value;
  const end = start + pageSize.value;
  return filteredQaData.value.slice(start, end);
});

const averageSimilarityScore = computed(() => {
  const scores = Object.values(similarityScores.value).flat();
  return scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
});

const tableHeaders = computed(() => {
  const baseHeaders = [
    { key: 'question', label: 'Question' },
    { key: 'answer', label: 'Answer' },
  ];
  const modelHeaders = selectedModels.value.flatMap(model => [
    { key: model, label: `${model} Output` },
    { key: `${model}Score`, label: `${model} Score` },
  ]);
  return [...baseHeaders, ...modelHeaders, { key: 'status', label: 'Status' }];
});

const similarity = (x: Vector, y: Vector): number => {
  const dot = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const magX = Math.sqrt(x.reduce((sum, xi) => sum + xi * xi, 0));
  const magY = Math.sqrt(y.reduce((sum, yi) => sum + yi * yi, 0));

  return magX && magY ? dot / (magX * magY) : 0;
};

const generateEmbedding = async (model: string, prompt: string): Promise<Vector> => {
  const response = await ollama.embeddings({ model, prompt });
  return response.embedding;
};

const processQA = async (qa: QA, index: number) => {
  try {
    qa.status = "⏳"; // Set status to loading
    for (const model of selectedModels.value) {
      const response = await ollama.chat({
        model,
        messages: [{ role: "user", content: `reply with one or two words only. ${qa.question}` }],
      });
      const generatedAnswer = response.message.content.replace(/\.$/, "");

      const [answerEmbedding, generatedEmbedding] = await Promise.all([
        generateEmbedding("nomic-embed-text", qa.answer),
        generateEmbedding("nomic-embed-text", generatedAnswer)
      ]);

      const similarityScore = similarity(answerEmbedding, generatedEmbedding);

      if (!generatedAnswers.value[model]) {
        generatedAnswers.value[model] = Array(sampleQA.value.length).fill('');
      }
      if (!similarityScores.value[model]) {
        similarityScores.value[model] = Array(sampleQA.value.length).fill(0);
      }

      generatedAnswers.value[model][index] = generatedAnswer;
      similarityScores.value[model][index] = similarityScore;
    }
    qa.status = "✅"; // Set status to completed
  } catch (error) {
    console.error(`Error processing QA pair at index ${index}:`, error);
    qa.status = "❌"; // Set status to error
  }
};

const generateAnswers = async () => {
  isLoading.value = true;
  await Promise.allSettled(sampleQA.value.map((qa, index) => processQA(qa, index)));
  isLoading.value = false;
};

const generateNewQAPair = async () => {
  if (!newQuestionTopic.value.trim()) {
    alert("Please enter a topic for the new question.");
    return;
  }

  isGeneratingNewQA.value = true;

  try {
    // Generate a new question based on the topic
    const questionResponse = await ollama.chat({
      model: selectedModels.value[0],
      messages: [{ role: "user", content: `Generate a concise question about ${newQuestionTopic.value}.` }],
    });
    const newQuestion = questionResponse.message.content.trim();

    // Generate an answer for the new question
    const answerResponse = await ollama.chat({
      model: selectedModels.value[0],
      messages: [
        { role: "user", content: `Answer the following question in one or two words only: ${newQuestion}` },
      ],
    });
    const newAnswer = answerResponse.message.content.trim();

    // Add the new QA pair to the list
    sampleQA.value.unshift({
      question: newQuestion,
      answer: newAnswer,
      status: "⏳",
    });

    // Process the new QA pair
    await processQA(sampleQA.value[0], 0);

    newQuestionTopic.value = '';
  } catch (error) {
    console.error("Error generating new QA pair:", error);
    alert("An error occurred while generating the new QA pair. Please try again.");
  } finally {
    isGeneratingNewQA.value = false;
  }
};

const generateBatchQAPairs = async () => {
  if (!batchTopics.value.trim()) {
    alert("Please enter topics for batch generation.");
    return;
  }

  isGeneratingBatch.value = true;

  try {
    const topics = batchTopics.value.split(',').map(topic => topic.trim());
    for (const topic of topics) {
      // Generate a new question based on the topic
      const questionResponse = await ollama.chat({
        model: selectedModels.value[0],
        messages: [{ role: "user", content: `Generate a concise question about ${topic}.` }],
      });
      const newQuestion = questionResponse.message.content.trim();

      // Generate an answer for the new question
      const answerResponse = await ollama.chat({
        model: selectedModels.value[0],
        messages: [
          { role: "user", content: `Answer the following question in one or two words only: ${newQuestion}` },
        ],
      });
      const newAnswer = answerResponse.message.content.trim();

      // Add the new QA pair to the list
      sampleQA.value.push({
        question: newQuestion,
        answer: newAnswer,
        status: "⏳",
      });

      // Process the new QA pair
      await processQA(sampleQA.value[sampleQA.value.length - 1], sampleQA.value.length - 1);
    }

    batchTopics.value = '';
  } catch (error) {
    console.error("Error generating batch QA pairs:", error);
    alert("An error occurred while generating batch QA pairs. Please try again.");
  } finally {
    isGeneratingBatch.value = false;
  }
};

const exportData = () => {
  const dataStr = JSON.stringify(qaData.value);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  const exportFileDefaultName = 'qa_data.json';

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

const importData = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        sampleQA.value = importedData;
        generateAnswers(); // Re-generate answers for imported data
      } catch (error) {
        console.error("Error parsing imported data:", error);
        alert("Error importing data. Please make sure the file is valid JSON.");
      }
    };
    reader.readAsText(file);
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
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < Math.ceil(filteredQaData.value.length / pageSize.value) - 1) {
    currentPage.value++;
  }
};

const getSimilarityScoreClass = (score: number | undefined) => {
  if (score === undefined) return '';
  if (score >= 0.8) return 'text-green-600 font-semibold';
  if (score >= 0.6) return 'text-yellow-600';
  return 'text-red-600';
};

const getStatusClass = (status: string) => {
  switch (status) {
    case '✅': return 'text-green-600';
    case '❌': return 'text-red-600';
    default: return 'text-yellow-600';
  }
};

watch(selectedModels, generateAnswers);

// Initial generation of answers
generateAnswers();
</script>
