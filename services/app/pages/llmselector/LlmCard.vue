<template>
  <article class="flex flex-col grow px-4 pt-4 pb-9 mx-auto w-full bg-white rounded shadow max-md:mt-6">
    <img :src="llm.image" :alt="llm.name" class="w-full aspect-1.59 object-cover" />
    <p class="mt-6 text-sm leading-5 text-zinc-400">{{ llm.company }}</p>
    <h2 class="mt-5 text-lg leading-7 text-blue-600">{{ llm.name }}</h2>
    <p class="mt-5 text-xs leading-5 text-zinc-900">{{ llm.description }}
      <button class="ml-2 text-xs text-blue-500">{{ 'Read More' }}</button>
    </p>
    <div class="flex gap-1 justify-center px-2 mt-3 text-2.6 leading-5 bg-black bg-opacity-0 max-md:pr-5">
      <span
        v-for="(capability, index) in llm.capabilities"
        :key="index"
        :class="[
          'justify-center px-2 py-2 rounded',
          {
            'bg-gray-100 text-zinc-700': capability === 'Text Reasoning',
            'bg-cyan-50 text-cyan-500': capability === 'Image Generation' || capability === 'Text Summarization',
            'bg-violet-50 text-violet-500': capability === 'Coding' || capability === 'Code Generation' || capability === 'Personalized' || capability === 'Accurate',
            'bg-pink-50 text-pink-500': capability === 'Creative Writing',
            'bg-green-50 text-green-500': capability === 'Query Response',
          }
        ]"
      >
        {{ capability }}
      </span>
    </div>
    <div class="flex gap-5 justify-between mt-3.5 text-3 font-semibold leading-3 text-white">
      <button class="flex justify-center px-7 py-3.5 bg-cyan-500 rounded max-md:px-5 leading-4">Visit Website</button>
      <button class="flex justify-center px-6 py-3.5 bg-cyan-500 rounded max-md:px-5 leading-4">Select the LLM</button>
    </div>
  </article>
</template>

<script>
export default {
  name: 'LlmCard',
  props: {
    llm: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
/* Ensure that image fills the container and maintains aspect ratio */
img {
  object-fit: cover;
}

/* Add styles to ensure consistent behavior for capabilities */
span {
  white-space: nowrap;
}

article {
  max-width: 320px; /* Ensuring a consistent card width */
}

@media (min-width: 768px) {
  article {
    max-width: 24%;
  }
}
</style>
