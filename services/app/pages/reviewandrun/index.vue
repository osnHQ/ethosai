<template>
    <div>
        <ReviewAndRun />
    </div>
</template>

<script setup>
import ReviewAndRun from "./ReviewAndRun.vue"

const color = useColorMode()
color.value === 'light'
color.preference = 'light'

</script>