<template>
    <span class="inline-flex items-center ml-2">
      <svg
        v-if="currentSortKey === sortKey && sortOrder === 'asc'"
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
      </svg>
      <svg
        v-else-if="currentSortKey === sortKey && sortOrder === 'desc'"
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 text-gray-400 dark:text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </span>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue'
  
  const props = defineProps({
    sortKey: {
      type: String,
      required: true,
    },
    currentSortKey: {
      type: String,
      required: true,
    },
    sortOrder: {
      type: String,
      required: true,
      validator: (value: string) => ['asc', 'desc'].includes(value),
    },
  })
  </script>
  