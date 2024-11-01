<template>
    <div>
        <LlmComparison />
    </div>
</template>

<script setup>
import LlmComparison from "./llmcomparison.vue";

const color = useColorMode()
color.value === 'light'
color.preference = 'light'
</script>