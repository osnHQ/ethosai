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
          <div class="flex flex-col sm:flex-row gap-4 mt-8 w-full">
            <div class="flex items-center w-full sm:w-auto bg-gray-100 rounded-lg border border-gray-300">
              <NuxtImg loading="lazy" src="/search.png" alt="Search icon" class="w-5 h-5 ml-3" />
              <input type="text" placeholder="Search for the LLMs here (by name, company etc)" aria-label="Search for LLMs" class="flex-grow p-3 bg-transparent text-black placeholder-gray-500 focus:outline-none rounded-r-lg" />
            </div>
            <select class="bg-white border border-gray-300 rounded-lg p-3 w-full sm:w-auto">
              <option>Company / Developer</option>
            </select>
            <select class="bg-white border border-gray-300 rounded-lg p-3 w-full sm:w-auto">
              <option>Filter by capabilities ( Text , Image , Video)</option>
            </select>
          </div>
          <NuxtImg loading="lazy" src="/question.png" class="mt-4 w-6 h-6" alt="Help icon" />
        </header>
        <p class="self-end mt-4 text-sm leading-6 text-right text-black">
          Total <span class="font-bold text-cyan-500">14</span> LLMs
        </p>
        <main class="self-center px-5 mt-10 w-full max-w-[1365px] max-md:max-w-full">
          <div class="flex gap-5 max-md:flex-col max-md:gap-0">
            <LlmCard
              v-for="(llm, index) in llms"
              :key="index"
              :llm="llm"
              class="flex flex-col w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
            />
          </div>
        </main>
        <nav class="flex gap-1 self-center mt-14 text-sm leading-5 text-zinc-400" aria-label="Pagination">
          <a href="#" class="flex items-center text-white">
            <NuxtImg loading="lazy" src="/paginationleft.png" alt="Previous page" class="w-5 h-5 mr-2" />
            <span class="sr-only">Previous page</span>
          </a>
          <a href="#" aria-current="page" class="px-4 py-2 bg-cyan-500 rounded text-white">
            1
          </a>
          <a href="#" class="px-4 py-2 bg-white rounded border border-gray-300">
            2
          </a>
          <a href="#" class="px-4 py-2 bg-white rounded border border-gray-300">
            3
          </a>
          <a href="#" class="px-4 py-2 bg-white rounded border border-gray-300">
            4
          </a>
          <span class="flex items-center gap-1">
            <NuxtImg loading="lazy" src="/paginationdots.png" alt="Dots" class="w-5 h-5" />
            <a href="#" class="px-4 py-2 bg-white rounded border border-gray-300">
              10
            </a>
            <a href="#" class="px-4 py-2 bg-white rounded border border-gray-300">
              11
            </a>
          </span>
          <a href="#" class="flex items-center text-zinc-400">
            <NuxtImg loading="lazy" src="/paginationright.png" alt="Next page" class="w-5 h-5 ml-2" />
            <span class="sr-only">Next page</span>
          </a>
        </nav>
      </section>
    </main>
  </div>
</template>

<script>
import LlmCard from './LlmCard.vue';
export default {
  name: 'LlmSelector',
  components: {
    LlmCard,
  },
  data() {
    return {
      llms: [
        {
          company: 'OpenAI',
          name: 'GPT-4o',
          description: 'GPT-4o is the latest of Open AI with unprecedent capabilities in both Text, and Image ..',
          image: 'openaicard.png',
          capabilities: ['Text Reasoning', 'Image Generation', 'Coding'],
        },
        {
          company: 'Meta',
          name: 'Llama2',
          description: 'Llama2 is a family of LLMs developed by Meta that can be used for Text generation, Code..',
          image: 'metacard.png',
          capabilities: ['Text Summarization', 'Code Generation'],
        },
        {
          company: 'Anthropic',
          name: 'Claude 2',
          description: 'This is your neighbourhood friendly AI that can help in sharing knowledge, creative writing..',
          image: 'anthropiccard.png',
          capabilities: ['Creative Writing', 'Personalized'],
        },
        {
          company: 'Mistral AI',
          name: 'Mistral 7B',
          description: '7B is developed by Mistral AI that can help in variety of tasks including responding to ...',
          image: 'mistralcard.png',
          capabilities: ['Query Response', 'Accurate'],
        },
      ],
    };
  },
};
</script>