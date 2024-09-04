<template>
    <div>
        <CreateConfig />
    </div>
</template>

<script setup>
import CreateConfig from "./createconfig.vue"

const color = useColorMode()
color.value === 'light'
color.preference = 'light'
</script>