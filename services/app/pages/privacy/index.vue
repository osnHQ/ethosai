<template>
    <div>
        <Privacy/>
    </div>
</template>

<script setup>
import Privacy from "./privacy.vue"

const color = useColorMode()
color.value === 'light'
color.preference = 'light'

</script>