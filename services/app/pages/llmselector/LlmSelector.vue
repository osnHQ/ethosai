<template>
  <div class="w-225 relative shadow bg-white flex items-start justify-end text-left text-base text-dimgray font-inter">
    <main class="flex-1 flex flex-col items-start justify-start pt-6 px-0 pb-0 max-w-xl">
      <section class="flex flex-col pb-20 bg-white rounded shadow-sm">
        <header class="flex flex-col pl-7 w-full text-zinc-900 max-md:pl-5 max-md:max-w-full">
          <h1 class="flex gap-5 self-start text-3xl leading-10">
            <span class="flex-auto">LLM Selector</span>
            <img loading="lazy" src="public/loading.png" class="w-10 aspect-square" alt="Loading" />
          </h1>
          <p class="mt-7 text-base leading-7 text-neutral-800 max-md:max-w-full">
            Choose an LLM to test your configuration files against our robust evaluation metrics.
          </p>
          <div class="flex gap-5 justify-between mt-16 w-full text-sm leading-5 max-md:flex-wrap max-md:pr-5 max-md:mt-10 max-md:max-w-full">
            <div class="flex py-2 rounded mr-3 border border-solid bg-black bg-opacity-0 border-zinc-900 text-neutral-300 flex-grow w-52">
              <img loading="lazy" src="public/search.png" alt="" class="w-5" />
              <input type="text" placeholder="Search for the LLMs here (by name, company etc)" aria-label="Search for LLMs" class="flex-grow outline-none focus:outline-none focus:shadow-none text-black placeholder-text-3.7 text-4 w-50" />
            </div>
            <select class="bg-white border border-solid border-zinc-900 rounded px-2 py-2 w-full md:w-auto">
              <option>Company / Developer</option>
            </select>
            <select class="bg-white border border-solid border-zinc-900 rounded px-2 py-2 w-full md:w-auto">
              <option>Filter by capabilities ( Text , Image , Video)</option>
            </select>
          </div>
          <img loading="lazy" src="public/question.png" class="mt-3.5 w-6 aspect-square" alt="" />
        </header>
        <p class="self-end mt-1 mr-8 text-sm leading-6 text-right text-black max-md:mr-2.5">
          Total <span class="font-bold text-cyan-500">14</span> LLMs
        </p>
        <main class="self-center px-5 mt-10 w-full max-md:max-w-full">
          <div class="flex gap-5 max-md:flex-col max-md:gap-0">
            <LlmCard
              v-for="(llm, index) in llms"
              :key="index"
              :llm="llm"
              class="flex flex-col w-3/12 max-md:ml-0 max-md:w-full"
            />
          </div>
        </main>
        <nav class="flex gap-1 self-center mt-14 max-w-full text-sm leading-5 whitespace-nowrap text-zinc-400 w-[344px] max-md:mt-10" aria-label="Pagination">
        <a href="#" class="flex gap-0.5 text-white">
          <img loading="lazy" src="public/paginationleft.png" alt="Previous page" class="w-5 h-5 mt-3.5 mr-2" />
          <span class="sr-only">Previous page</span>
        </a>
        <a href="#" aria-current="page" class="justify-center items-start px-4 py-3.5 bg-cyan-500 rounded text-white">
          1
        </a>
        <a href="#" class="justify-center items-start px-4 py-3.5 bg-white rounded border border-solid border-zinc-200">
          2
        </a>
        <a href="#" class="justify-center items-start px-4 py-3.5 bg-white rounded border border-solid border-zinc-200">
          3
        </a>
        <a href="#" class="justify-center items-start px-4 py-3.5 bg-white rounded border border-solid border-zinc-200">
          4
        </a>
        <span class="flex gap-1">
          <img loading="lazy" src="public/paginationdots.png" alt="" class="w-5 h-5 mt-3.5 aspect-square border-zinc-200" />
          <a href="#" class="justify-center items-start px-4 py-3.5 bg-white rounded border border-solid border-zinc-200">
            10
          </a>
          <a href="#" class="justify-center items-start px-4 py-3.5 bg-white rounded border border-solid border-zinc-200">
            11
          </a>
        </span>
        <a href="#" class="flex gap-0.5 text-zinc-400">
          <img loading="lazy" src="public/paginationright.png" alt="Next page" class="w-5 h-5 mt-3.5 ml-5" />
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
  