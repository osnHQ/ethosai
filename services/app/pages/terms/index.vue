<template>
    <div>
        <Terms />
    </div>
</template>

<script setup>
import Terms from "./terms.vue"

const color = useColorMode()
color.value === 'light'
color.preference = 'light'

</script>