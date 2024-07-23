<template>
  <div class="bg-gray-800 p-3 rounded-lg" :class="[color]">
    <div class="flex justify-between items-center mb-1">
      <div class="flex items-center">
        <span class="mr-2 text-xl">{{ emoji }}</span>
        <h4 class="font-semibold text-xs sm:text-sm">
{{ title }}
</h4>
      </div>
      <span v-if="change" class="text-xs" :class="[change.startsWith('+') ? 'text-green-500' : 'text-red-500']">
        {{ change }}
      </span>
    </div>
    <p class="font-bold text-white text-xl sm:text-2xl">
{{ value }}
</p>
    <p v-if="subtitle" class="text-gray-300 text-xs">
{{ subtitle }}
</p>
  </div>
</template>

<script>
export default {
  props: ['emoji', 'title', 'value', 'change', 'color', 'subtitle'],
}
</script>
