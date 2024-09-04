<template>
    <div>
        <CreateConfig />
    </div>
</template>

<script setup>
import CreateConfig from "./CreateConfig.vue"

const color = useColorMode()
color.value === 'light'
color.preference = 'light'
</script>