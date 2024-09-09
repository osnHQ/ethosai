<template>
  <article class="flex flex-col overflow-hidden rounded-lg shadow-lg bg-white">
    <div class="flex-shrink-0">
      <NuxtImg :src="llm.image" :alt="llm.name" class="h-48 w-full object-cover">
    </div>
    <div class="flex flex-1 flex-col justify-between p-6">
      <div class="flex-1">
        <p class="text-sm font-medium text-indigo-600">
          <a href="#" class="hover:underline">{{ llm.company }}</a>
        </p>
        <a href="#" class="mt-2 block">
          <h3 class="text-xl font-semibold text-gray-900">{{ llm.name }}</h3>
          <p class="mt-3 text-base text-gray-500">{{ truncatedDescription }}</p>
        </a>
      </div>
      <div class="mt-6 flex flex-wrap gap-2">
        <span v-for="(capability, index) in llm.capabilities" :key="index" :class="capabilityClasses(capability)">
          {{ capability }}
        </span>
      </div>
    </div>
    <div class="bg-gray-50 px-6 py-4">
      <div class="flex items-center justify-between space-x-3">
        <a href="#" class="flex-1">
          <button class="w-full bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Visit Website
          </button>
        </a>
        <a href="#" class="flex-1">
          <button class="w-full bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Select LLM
          </button>
        </a>
      </div>
    </div>
  </article>
</template>

<script>
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'LlmCard',
  props: {
    llm: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const truncatedDescription = computed(() => {
      const length = 100;
      return props.llm.description.length > length 
        ? props.llm.description.substring(0, length) + '...' 
        : props.llm.description;
    });

    const capabilityClasses = (capability) => {
      return [
        'inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium',
        {
          'bg-gray-100 text-gray-800': capability === 'Text Reasoning',
          'bg-cyan-100 text-cyan-800': capability === 'Image Generation' || capability === 'Text Summarization',
          'bg-indigo-100 text-indigo-800': capability === 'Coding' || capability === 'Code Generation',
          'bg-purple-100 text-purple-800': capability === 'Personalized' || capability === 'Accurate',
          'bg-pink-100 text-pink-800': capability === 'Creative Writing',
          'bg-green-100 text-green-800': capability === 'Query Response',
        }
      ];
    };

    return {
      truncatedDescription,
      capabilityClasses,
    };
  },
});
</script>
