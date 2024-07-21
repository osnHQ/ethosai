<template>
    <div>
        <selectconfig />
    </div>
</template>

<script setup>
import selectconfig from "./selectconfig.vue"

const color = useColorMode()
color.value === 'light'
color.preference = 'light'

</script>