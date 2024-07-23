<template>
    <div class="border-gray-700 bg-gray-800 p-4 border rounded-lg">
      <h3 class="mb-4 font-semibold text-lg">
{{ title }}
</h3>
      <slot />
    </div>
  </template>

<script>
export default {
  props: ['title'],
}
</script>
