<template>
  <div class="w-full h-screen flex bg-gray-900 text-left text-base text-dimgray font-inter">
   
    <aside
      :class="{
        hidden: !isSidebarOpen && isMobile,
        block: isSidebarOpen || !isMobile,
        'fixed md:relative': true,
        'inset-0': isSidebarOpen && isMobile,
        'z-30': true,
      }"
      class="w-64 min-h-screen bg-gray-900 shadow-lg transition-transform transform md:translate-x-0"
    >
      <Sidebar @toggleSidebar="toggleSidebar" />
    </aside>

    
    <div
      v-if="isSidebarOpen && isMobile"
      class="fixed inset-0 bg-black opacity-30 z-20"
      @click="toggleSidebar"
    ></div>

    
    <div class="flex-1 flex flex-col overflow-auto">
      <main
        class="flex-1 flex flex-col px-8 pb-3.5 w-full bg-gray-900 rounded shadow-sm shadow-gray-800 max-w-[1676px] max-md:px-5 max-md:max-w-full"
      >
        <section class="w-full flex items-start pb-10 pt-5">
          <h1 class="text-5xl text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400">
            LLM Leaderboard
          </h1>
        </section>

       
        <div class="container mx-auto px-4">
          <h1 class="text-2xl font-bold mb-4 text-white">Compare Models</h1>
          <p class="text-gray-400 mb-6">
            Visualize and analyze the performance differences between multiple LLM models.
          </p>

          
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            <div
              v-for="(model, index) in llms"
              :key="index"
              class="bg-gray-800 border shadow-2xl border-gray-700 rounded-2xl p-4 h-full flex flex-col transition-transform transform hover:scale-105"
            >
              <img :src="model.image" alt="Image of {{ model.name }}" class="mb-4 rounded-md" />

              <h2 class="text-xl font-semibold text-gray-200">{{ model.name }}</h2>
              <p class="text-gray-300 mb-4">{{ model.company }}</p>

              <div class="flex flex-col">
  <div
    v-for="(metric, key) in model.metrics"
    :key="key"
    class="border border-gray-600 rounded-md p-2 mb-2 flex justify-between items-center bg-gray-800"
  >
    <div class="flex-1">
      <p class="text-sm font-semibold text-gray-300">{{ metric.label }}</p>
    </div>
    <div class="flex items-center ">
      <span class="flex justify-center items-center w-10 h-10 rounded-full bg-gray-700 text-gray-200">
        {{ metric.value }}
        <span class="text-xs text-gray-400">{{ metric.unit }}</span>
      </span>
    </div>
  </div>
</div>

            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useWindowSize } from '@vueuse/core'; 

const isSidebarOpen = ref(false); 

const { width } = useWindowSize(); 
const isMobile = computed(() => width.value < 768); 

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const llms = ref([
  {
    company: 'OpenAI',
    name: 'GPT-4o',
    description: 'GPT-4o is the latest of Open AI with unprecedented capabilities...',
    image: 'openaicard.png', 
    capabilities: ['Text Reasoning', 'Image Generation', 'Coding'],
    metrics: {
      factualAccuracy: { label: 'Factual Accuracy', value: 85, unit: '%' },
      answerRelevancy: { label: 'Answer Relevancy', value: 91, unit: '%' },
      bias: { label: 'Bias (Sexual / Race)', value: 12, unit: '%' },
      toxicity: { label: 'Toxicity of Response', value: 5, unit: '%' },
      speedOfResponse: { label: 'Speed of Response', value: 1.1, unit: 's' },
      hallucination: { label: 'Hallucination', value: 12, unit: '%' },
    },
  },
  {
    company: 'Meta',
    name: 'Llama2',
    description: 'Llama2 is a family of LLMs developed by Meta that can be used...',
    image: 'metacard.png', 
    capabilities: ['Text Summarization', 'Code Generation'],
    metrics: {
      factualAccuracy: { label: 'Factual Accuracy', value: 87, unit: '%' },
      answerRelevancy: { label: 'Answer Relevancy', value: 81, unit: '%' },
      bias: { label: 'Bias (Sexual / Race)', value: 10, unit: '%' },
      toxicity: { label: 'Toxicity of Response', value: 2, unit: '%' },
      speedOfResponse: { label: 'Speed of Response', value: 1.4, unit: 's' },
      hallucination: { label: 'Hallucination', value: 13, unit: '%' },
    },
  },
  {
    company: 'Anthropic',
    name: 'Claude 2',
    description: 'This is your neighborhood-friendly AI that can help in creative writing...',
    image: 'anthropiccard.png', 
    capabilities: ['Creative Writing', 'Personalized'],
    metrics: {
      factualAccuracy: { label: 'Factual Accuracy', value: 90, unit: '%' },
      answerRelevancy: { label: 'Answer Relevancy', value: 91, unit: '%' },
      bias: { label: 'Bias (Sexual / Race)', value: 10, unit: '%' },
      toxicity: { label: 'Toxicity of Response', value: 3, unit: '%' },
      speedOfResponse: { label: 'Speed of Response', value: 1.5, unit: 's' },
      hallucination: { label: 'Hallucination', value: 11, unit: '%' },
    },
  },
  {
    company: 'Mistral AI',
    name: 'Mistral 7B',
    description: '7B is developed by Mistral AI that can help in responding to...',
    image: 'mistralcard.png', 
    capabilities: ['Query Response', 'Accurate'],
    metrics: {
      factualAccuracy: { label: 'Factual Accuracy', value: 78, unit: '%' },
      answerRelevancy: { label: 'Answer Relevancy', value: 75, unit: '%' },
      bias: { label: 'Bias (Sexual / Race)', value: 14, unit: '%' },
      toxicity: { label: 'Toxicity of Response', value: 5, unit: '%' },
      speedOfResponse: { label: 'Speed of Response', value: 1.6, unit: 's' },
      hallucination: { label: 'Hallucination', value: 14, unit: '%' },
    },
  },
]);
</script>

