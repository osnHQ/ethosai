<template>
    <div>
        <LlmSelector />
    </div>
</template>

<script setup>
import LlmSelector from "./LlmSelector.vue"

const color = useColorMode()
color.value === 'light'
color.preference = 'light'

</script>