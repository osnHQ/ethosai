<template>
  <div
    class="bg-gradient-to-br from-gray-100 dark:from-gray-900 via-gray-200 dark:via-gray-800 to-gray-300 dark:to-gray-900 px-4 sm:px-6 lg:px-8 py-12 min-h-screen transition-all duration-500">
    <div class="mx-auto max-w-5xl">
      <h1
        class="bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-10 font-extrabold text-4xl text-center text-transparent sm:text-6xl animate-pulse">
        Audit Report Demo
      </h1>

      <div class="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden">
        <div class="bg-gray-200 dark:bg-gray-700 h-2">
          <div class="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 transition-all duration-500 ease-out"
            :style="{ width: `${(step / 5) * 100}%` }"></div>
        </div>

        <div class="p-8">
          <div class="flex justify-between mb-8">
            <div v-for="i in 5" :key="i" class="flex flex-col items-center">
              <div :class="[
                'rounded-full h-10 w-10 flex items-center justify-center text-white font-semibold',
                step >= i ? 'bg-indigo-600' : 'bg-gray-400 dark:bg-gray-600'
              ]">
                {{ i }}
              </div>
              <div class="mt-2 text-gray-600 text-xs dark:text-gray-400">
                {{ stepLabels[i - 1] || 'Report' }}
              </div>
            </div>
          </div>

          <div :key="step" class="space-y-4">
            <div v-if="step <= 4">
              <h2 class="mb-6 font-semibold text-3xl text-gray-800 dark:text-gray-100">
                {{ stepTitles[step - 1] }}
              </h2>
              <div class="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <div v-for="option in stepOptions[step - 1]" :key="option.value"
                  @click="selectOption(stepTypes[step - 1], option.value)"
                  class="bg-gray-100 dark:bg-gray-700 shadow-md hover:shadow-lg p-6 rounded-xl transition-all duration-300 cursor-pointer"
                  :class="{
                    'ring-2 ring-indigo-600 bg-indigo-100 dark:bg-indigo-700': selectedOptions[stepTypes[step - 1]] === option.value
                  }">
                  <div class="flex items-center">
                    <div :class="[
                      'rounded-full p-3',
                      selectedOptions[stepTypes[step - 1]] === option.value ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'
                    ]">
                      <span class="text-2xl">{{ option.icon }}</span>
                    </div>
                    <div class="ml-4">
                      <h3 class="font-medium text-gray-800 text-lg dark:text-gray-100 capitalize">{{ option.label }}
                      </h3>
                      <p class="mt-1 text-gray-600 text-sm dark:text-gray-400">{{ getDescription(stepTypes[step - 1],
                        option.value) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="report" class="bg-white dark:bg-gray-800 shadow-lg mt-12 rounded-2xl overflow-hidden">
              <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                <h2 class="font-bold text-3xl text-white">Generated Report</h2>
                <p class="mt-2 text-indigo-100">Based on your selections, we've generated the following report:</p>
              </div>
              <div class="p-8">
                <div class="gap-6 grid grid-cols-1 md:grid-cols-2 mb-6">
                  <div class="bg-indigo-50 dark:bg-gray-700 shadow-md p-4 rounded-lg">
                    <h3 class="font-semibold text-indigo-900 dark:text-indigo-300">Audit Section</h3>
                    <p class="mt-1 text-indigo-700 dark:text-indigo-400 capitalize">{{ report.auditSection }}</p>
                  </div>
                  <div class="bg-purple-50 dark:bg-gray-700 shadow-md p-4 rounded-lg">
                    <h3 class="font-semibold text-purple-900 dark:text-purple-300">Category</h3>
                    <p class="mt-1 text-purple-700 dark:text-purple-400 capitalize">{{ report.category.replace('_', ' ')
                      }}</p>
                  </div>
                  <div class="bg-indigo-50 dark:bg-gray-700 shadow-md p-4 rounded-lg">
                    <h3 class="font-semibold text-indigo-900 dark:text-indigo-300">Bias File</h3>
                    <p class="mt-1 text-indigo-700 dark:text-indigo-400 capitalize">{{ report.biasFile.replace(/_/g, ' ') }}</p>
                  </div>
                  <div class="bg-purple-50 dark:bg-gray-700 shadow-md p-4 rounded-lg">
                    <h3 class="font-semibold text-purple-900 dark:text-purple-300">GPT Model</h3>
                    <p class="mt-1 text-purple-700 dark:text-purple-400 uppercase">{{ report.gptModel }}</p>
                  </div>
                </div>
                <div class="bg-gray-100 dark:bg-gray-700 shadow-md p-6 rounded-lg">
                  <h3 class="mb-4 font-semibold text-gray-800 text-xl dark:text-gray-100">Analysis Summary</h3>
                  <p class="mb-4 text-gray-700 dark:text-gray-300">{{ report.summary }}</p>
                  <h4 class="mb-2 font-semibold text-gray-800 text-lg dark:text-gray-100">Key Findings:</h4>
                  <ul class="space-y-2 pl-5 text-gray-700 dark:text-gray-300 list-disc">
                    <li v-for="(finding, index) in report.keyFindings" :key="index">{{ finding }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!report" class="flex justify-between mt-10">
        <button @click="prevStep"
          class="bg-gray-600 hover:bg-gray-700 dark:hover:bg-gray-700 dark:bg-gray-800 disabled:opacity-50 px-4 py-2 rounded-lg text-gray-100 dark:text-gray-100 transition-all duration-300"
          :disabled="step === 1">
          Previous
        </button>
        <button @click="nextStep"
          class="bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-600 dark:bg-indigo-700 px-4 py-2 rounded-lg text-white transition-all duration-300"
          :disabled="step === 5">
          {{ step === 4 ? 'Finish' : 'Next' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const step = ref(1);
const selectedOptions = ref({ auditSection: '', category: '', biasFile: '', model: '' });
const report = ref(null);

const stepTitles = ['Choose Audit Section', 'Choose Category', 'Choose Bias File', 'Choose Model'];
const stepLabels = ['Audit', 'Category', 'Bias File', 'Model'];
const stepTypes = ['auditSection', 'category', 'biasFile', 'model'];

const stepOptions = [
  [
    { value: 'factual', label: 'Factual', icon: '🔍' },
    { value: 'bias', label: 'Bias', icon: '⚖️' },
  ],
  [
    { value: 'india_geography', label: 'India Geography', icon: '🌏' },
    { value: 'world_history', label: 'World History', icon: '📜' },
    { value: 'science', label: 'Science', icon: '🔬' },
  ],
  [
    { value: 'bias1.json', label: 'Bias File 1', icon: '📂' },
    { value: 'bias2.json', label: 'Bias File 2', icon: '📂' },
    { value: 'bias3.json', label: 'Bias File 3', icon: '📂' },
  ],
  [
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', icon: '🤖' },
    { value: 'gpt-4', label: 'GPT-4', icon: '🤖' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', icon: '🤖' },
  ],
];

const selectOption = (type, value) => {
  selectedOptions.value[type] = value;
};

const generateReport = () => {
  report.value = {
    auditSection: selectedOptions.value.auditSection,
    category: selectedOptions.value.category,
    biasFile: selectedOptions.value.biasFile,
    gptModel: selectedOptions.value.model,
    summary: "Our analysis provides a thorough overview of the selected content, emphasizing strengths and suggesting areas for enhancement in terms of factual accuracy and bias mitigation. Our approach ensures a well-rounded evaluation considering various perspectives.",
    keyFindings: [
      "The content shows high factual accuracy, with 95% of claims corroborated by reliable sources.",
      "Some biases were identified, particularly in historical contexts, suggesting a predominantly Western perspective.",
      "Scientific explanations were clear and up-to-date with current terminology and theories.",
      "Suggestions for improvement include broadening sources and integrating diverse viewpoints in historical contexts."
    ]
  };
};

const prevStep = () => {
  if (step.value > 1) step.value -= 1;
};

const nextStep = () => {
  if (step.value === 4) {
    generateReport();
  }
  if (step.value < 5) step.value += 1;
};

const getDescription = (type, value) => {
  const descriptions = {
    auditSection: {
      factual: 'Identify and correct factual inaccuracies in the text.',
      bias: 'Assess potential biases present in the text.'
    },
    category: {
      india_geography: 'Content related to the geography of India.',
      world_history: 'Historical events and contexts from around the world.',
      science: 'Topics and principles related to science.'
    },
    biasFile: {
      'bias1.json': 'Bias data file 1 containing specific examples and information.',
      'bias2.json': 'Bias data file 2 with different examples of bias.',
      'bias3.json': 'Bias data file 3 with another set of bias examples.'
    },
    model: {
      'gpt-3.5-turbo': 'GPT-3.5 Turbo model, suitable for a range of tasks.',
      'gpt-4': 'GPT-4 model, providing more advanced capabilities.',
      'gpt-4-turbo': 'GPT-4 Turbo model, optimized for efficiency and performance.'
    }
  };
  return descriptions[type][value] || '';
};
</script>
