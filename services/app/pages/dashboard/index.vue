<template>
    <div>
        <Dashboard />
    </div>
</template>

<script setup>
import Dashboard from "./dashboard.vue"

const color = useColorMode()
color.value === 'light'
color.preference = 'light'
</script>