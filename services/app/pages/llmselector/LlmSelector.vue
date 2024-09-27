<template>
  <div class="w-full relative shadow bg-white flex flex-col items-start justify-start py-6 px-4 sm:px-7 gap-4 text-base text-dimgray font-inter">
    <main class="w-full flex flex-col items-start justify-start">
      <section class="w-full flex flex-col pb-20 bg-white rounded shadow-sm">
        <header class="w-full flex flex-col items-start text-zinc-900">
          <h1 class="flex items-center gap-3 text-3xl font-semibold leading-10">
            <span>LLM Selector</span>
            <NuxtImg loading="lazy" src="/loading.png" class="w-10 h-10" alt="Loading" />
          </h1>
          <p class="mt-4 text-base leading-7 text-neutral-800">
            Choose an LLM to test your configuration files against our robust evaluation metrics.
          </p>
        </header>

        <main class="self-center px-5 mt-10 w-full max-w-[1365px] max-md:max-w-full">
          <div class="flex gap-5 max-md:flex-col max-md:gap-0">
            <LlmCard
              v-for="(llm, index) in llms"
              :key="index"
              :llm="llm"
              :selected="selectedLlm && selectedLlm.name === llm.name"
              @select-llm="selectLlm(llm)"
              class="flex flex-col w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
            />
          </div>
        </main>

        <p v-if="selectedLlm" class="mt-4 text-lg leading-7 text-neutral-800">
          Selected LLM: <strong>{{ selectedLlm.name }}</strong> from {{ selectedLlm.company }}
        </p>
      </section>

      <button
        v-if="selectedLlm"
        @click="runEvaluation"
        class="mt-6 bg-indigo-600 text-white px-4 py-2 rounded-md"
      >
        Run Evaluation
      </button>
    </main>
  </div>
</template>

<script>
import LlmCard from './LlmCard.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'LlmSelector',
  components: {
    LlmCard,
  },
  setup() {
    const router = useRouter();
    const selectedLlm = ref(null);

    const llms = [
      {
        company: 'OpenAI',
        name: 'GPT-4o',
        description: 'GPT-4o is the latest of Open AI with unprecedent capabilities...',
        image: 'openaicard.png',
        capabilities: ['Text Reasoning', 'Image Generation', 'Coding'],
      },
      {
        company: 'Meta',
        name: 'Llama2',
        description: 'Llama2 is a family of LLMs developed by Meta that can be used...',
        image: 'metacard.png',
        capabilities: ['Text Summarization', 'Code Generation'],
      },
      {
        company: 'Anthropic',
        name: 'Claude 2',
        description: 'This is your neighborhood-friendly AI that can help in creative writing...',
        image: 'anthropiccard.png',
        capabilities: ['Creative Writing', 'Personalized'],
      },
      {
        company: 'Mistral AI',
        name: 'Mistral 7B',
        description: '7B is developed by Mistral AI that can help in responding to...',
        image: 'mistralcard.png',
        capabilities: ['Query Response', 'Accurate'],
      },
    ];

    const selectLlm = (llm) => {
      selectedLlm.value = llm;
    };

    const runEvaluation = () => {
      if (selectedLlm.value) {
        localStorage.setItem('selectedLlm', JSON.stringify(selectedLlm.value));

        router.push({ name: 'reviewandrun' });
      }
    };

    return {
      llms,
      selectedLlm,
      selectLlm,
      runEvaluation,
    };
  },
};
</script>
