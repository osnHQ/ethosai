<template>
  <div class="mb-3">
    <div class="flex justify-between items-center mb-1">
      <span class="text-sm">{{ title }}</span>
      <span class="font-semibold text-sm text-white">{{ value }}/{{ max }}</span>
    </div>
    <div class="bg-gray-700 rounded-full w-full h-2.5">
      <div class="rounded-full h-2.5" :class="[color]" :style="{ width: `${value / max * 100}%` }" />
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'value', 'max', 'color'],
}
</script>
